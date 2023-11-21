const db = require("../../../config/db");
const utils = require("../utils/utils.registro");
const utils2 = require("../utils/utils.registro_menor");
const { HttpError } = require("../../helpers/handleError");
const { emailSender } = require("../../services/mail/mail");


const pgp = require('pg-promise')({
  capSQL: true,
  schema: 'registro'
});

const db1 = pgp({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

const db2 = pgp({
  database: process.env.DB_NAME_MINEDU,
  user: process.env.DB_USER_MINEDU,
  password: process.env.DB_PASS_MINEDU,
  port: process.env.DB_PORT_MINEDU,
  host: process.env.DB_HOST_MINEDU,
});

const getVoluntarios = async (req, res) => {
  try {
    const data = await db.query(`
    SELECT *
    FROM persona.persona`);
    if (data.rows.length > 0) {
      const datos = data.rows;
      res.status(200).json({
        success: true,
        message: "exito",
        data: datos,
      });
    } else {
      res.status(204).json({
        success: true,
        message: "No se pudo encontrar los datos.",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
    });
  }
};

const verifySaveVoluntario = async (req, res) => {
  const cedula_identidad = req.query.cedula_identidad;
  const complemento = req.query.complemento;
  const fecha_nacimiento = req.query.fecha_nacimiento;
  console.log(req.query);
  try {
    const data = await db.query(`
    SELECT *
    FROM registro.persona
    WHERE cedula_identidad = '${cedula_identidad}' AND (complemento_ci = '${complemento}' OR fecha_nacimiento = '${fecha_nacimiento}')`);
    if (data.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "exito",
        data: { sended: true},
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No se pudo encontrar los datos.",
        data: { sended: false},
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
    });
  }
}

const createVoluntariosBulk = async (req, res) => {
  const data = req.body;
  //console.log('data :', data);
  try {
    const getDataVerif = await utils.verifyCedula(data, db);

    res.status(200).json({
      success: true,
      message: "Person created successfully",
      data: {
        getDataVerif
      },
    });

  } catch (error) {
    //await db2.query('ROLLBACK');
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
    });
  }
}

const createVoluntario = async (req, res) => {
  const data = req.body;
  try {
    const verifCedula = await db.query('SELECT COUNT(*) FROM registro.persona WHERE cedula_identidad = $1 AND (complemento_ci = $2 OR fecha_nacimiento = $3 )', [data.cedula_identidad, data.complemento, data.fecha_nacimiento]);
    if (verifCedula.rows[0].count == 0) {
      await db.query('BEGIN');
      const personData = utils.buildDatapersona(data);
      const id_persona = personData.id;
      const dataPersona = await db.query(personData.query, personData.dataSend);
      if (dataPersona.rowCount > 0) {
        const questionData = utils.builDataQuestion(data.medio_comunicacion, id_persona);
        const dataQuestion = await db.query(questionData.query, questionData.dataSend);
        if (dataQuestion.rowCount > 0) {
          const queryGetGeom = utils.buidlQueryGeo(data.latLng);
          let locationData;
          if (queryGetGeom != '') {
            locationData = await db.query(queryGetGeom);
          } else {
            const queryGetGeomCenter = utils.buidlQueryGeoPoint(data.id_departamento);
            const locationPoint = await db.query(queryGetGeomCenter);
            locationData = {
              rows: [{
                "id_departamento": data.id_departamento,
                "id_municipio": data.id_municipio,
                "id_utc": '',
                "geom": locationPoint.rows[0].geom,
              }]
            }
          }
          const registerData = utils.buildDataRegister(id_persona, locationData.rows[0], data.latLng);
          const dataRegister = await db.query(registerData.query, registerData.dataSend);
          if (dataRegister.rowCount > 0) {
            await db.query('COMMIT');
            res.status(200).json({
              success: true,
              message: "Voluntario created successfully",
              data: {},
            });

          } else {
            throw new HttpError("No se pudo dar de alta el registro. 0", 400);
          }
        } else {
          throw new HttpError("No se pudo dar de alta el registro. 1", 400);
        }
      } else {
        throw new HttpError("No se pudo dar de alta el registro. 2", 400);
      }

    } else {
      if (verifCedula.rows[0].count > 0) {
        res.status(400).json({
          success: false,
          message: "La cedula ya existe.",
          data: [verifCedula.rows[0].count],
        });
      } else {
        res.status(400).json({
          success: false,
          message: "La cedula ya existe.",
          data: [],
        });
      }
    }

  } catch (error) {
    await db.query('ROLLBACK');
    console.log(error);
    res.status(error.status ||  500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: [],
    });
  }
}

const updateVoluntario = async (req, res) => {
  const persona = req.body;
  const idPersona = req.params.id;
  try {
    await db.query('BEGIN');
    const dataPersona = await db.query(`
        UPDATE persona.persona
        SET cedula_identidad = $1, nombres = $2, apellidos = $3, celular = $4, fecha_nacimiento = $5
        WHERE id_persona = $6`,
      [persona.cedula_identidad, persona.nombres, persona.apellidos, persona.celular, persona.fecha_nacimiento, idPersona]
    );
    if (dataPersona) {
      await db.query('COMMIT')
      res.status(200).json({
        success: true,
        message: "Person updated successfully",
        data: {},
      });
    }

  } catch (error) {
    await db.query('ROLLBACK');
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
    });
  }

}

const deleteVoluntario = async (req, res) => {
  const idPersona = req.params.id;
  try {
    await db.query('BEGIN');
    const dataPersona = await db.query(`
        DELETE FROM persona.persona WHERE id_persona = $1`, [idPersona]);
    if (dataPersona) {
      await db.query('COMMIT')
      res.status(200).json({
        success: true,
        message: "Person deleted successfully",
        data: {},
      });
    }

  } catch (error) {
    await db.query('ROLLBACK');
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
    });
  }
}

const createMinorVoluntario = async (req, res) => {
  const data = req.body;
  console.log("🚀data:", data)
  try {
    const verifCedula = await db.query('SELECT COUNT(*) FROM registro.persona WHERE cedula_identidad = $1 AND (complemento_ci = $2 OR fecha_nacimiento = $3 )', [data.cedula_identidad, data.complemento, data.fecha_nacimiento]);
    if (verifCedula.rows[0].count == 0) {
      db1.tx(async (t) => {
        const personData = utils2.buildDatapersona(data);
        const id_persona = personData.id;
        const dataPersona = await t.query(personData.query, personData.dataSend);
        if (dataPersona.length > 0) {
          const questionData = utils2.builDataQuestion(data.medio_comunicacion, id_persona);
          const dataQuestion = await t.query(questionData.query, questionData.dataSend);
          if (dataQuestion.length > 0) {
            const queryGetGeom = utils2.buidlQueryGeo(data.latLng);
            let locationData;
            if (queryGetGeom != '') {
              locationData = await db.query(queryGetGeom);
            } else {
              const queryGetGeomCenter = utils2.buidlQueryGeoPoint(data.id_departamento);
              const locationPoint = await db.query(queryGetGeomCenter);
              locationData = {
                rows: [{
                  "id_departamento": data.id_departamento,
                  "id_municipio": data.id_municipio,
                  "id_utc": '',
                  "geom": locationPoint.rows[0].geom,
                }]
              }
            }
            const registerData = utils2.buildDataRegister(id_persona, locationData.rows[0], data.latLng);
            const dataRegister = await t.query(registerData.query, registerData.dataSend);
            if (dataRegister.length > 0) {
              const lastID = await db2.query(`SELECT cen_estudiante_inscripcion_censo_id as id FROM public.datos_censo ORDER BY cen_estudiante_inscripcion_censo_id DESC LIMIT 1`);
              const minEduData = utils2.buildDataMinEdu(data, locationData.rows[0], lastID[0].id);
              const dataMinEdu = await db2.query(minEduData.query, minEduData.dataSend);
              if (dataMinEdu.length > 0) {
                return dataRegister
                
              } else {
                throw new HttpError("No se pudo dar de alta el registro. 0", 400);
              }
            } else {
              throw new HttpError("No se pudo dar de alta el registro. 1", 400);
            }
          } else {
            throw new HttpError("No se pudo dar de alta el registro. 2", 400);
          }

        } else {
          throw new HttpError("No se pudo dar de alta el registro. 3", 400);
        }
      })
        .then((data) => {
          res.status(200).json({
            success: true,
            message: "Persona created successfully",
            data: [],
          })
        }).catch((err) => {
          console.log(err);
          res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Ocurrio un error.",
            data: [],
          })
        })

    } else {
      if (verifCedula.rows[0].count > 0) {
        res.status(400).json({
          success: false,
          message: "La cedula ya existe.",
          data: [verifCedula.rows[0].count],
        });
      } else {
        res.status(400).json({
          success: false,
          message: "La cedula ya existe.",
          data: [],
        });
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: [],
    });
  }
}


const sendEmailConfirmation = async (req, res) => {
  const data = req.body;
  try {
    const dataPersona = await db.query('SELECT * FROM registro.persona where cedula_identidad = $1 AND (complemento_ci = $2 or fecha_nacimiento = $3)', 
                                      [data.cedula_identidad, data.complemento, data.fecha_nacimiento]);
    if (dataPersona.rows.length == 1) {
      if (dataPersona.rows[0].email == '') {
        throw new HttpError("No tiene un correo registrado.", 400);
      } else {
          const emailSended = await emailSender(dataPersona.rows[0]);
          if (emailSended) {
            res.status(200).json({
              success: true,
              message: "Email sended successfully",
              data: {},
            });
          }
      }
    } else if(dataPersona.rows.length > 1) {
      throw new HttpError("Tiene una cédula de indetidad duplicada.", 400);
    } else {
      throw new HttpError("No tiene un regitro en la aplicación.", 400);
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
    });
  }
}


module.exports = {
  getVoluntarios,
  verifySaveVoluntario,
  createVoluntario,
  updateVoluntario,
  deleteVoluntario,
  createVoluntariosBulk,
  createMinorVoluntario,
  sendEmailConfirmation
};