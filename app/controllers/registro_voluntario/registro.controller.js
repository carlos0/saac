const db = require("../../../config/db");
const moment = require("moment");
const utils = require("../utils/utils.registro");


const pgp = require('pg-promise')({
  capSQL: true,
  schema: 'registro'
});

const db2 = pgp({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
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

const getVoluntarioId = async (req, res) => {
  const id_persona = req.params.id;
  try {
    const data = await db.query(`
    SELECT *
    FROM persona.persona
    WHERE id_persona = ${id_persona}`);
    if (data) {
      const datos = data.rows;
      res.status(200).json({
        success: true,
        message: "exito",
        data: datos,
      });
    } else {
      res.status(204).json({
        success: true,
        message: "No se pudo encontrar a la persona.",
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
  console.log("🚀 ~ file: registro.controller.js:106 ~ createVoluntario ~ data:", data)
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
            locationData = {rows: [{
              "id_departamento": data.id_departamento,
              "id_municipio": data.id_municipio,
              "id_utc": '',
              "geom": locationPoint.rows[0].geom,
            }]}
          }
          const registerData = utils.buildDataRegister(id_persona, locationData.rows[0], data.latLng);
          const dataRegister = await db.query(registerData.query, registerData.dataSend);
          if (dataRegister.rowCount > 0) {
            await db.query('COMMIT');
            res.status(200).json({
              success: true,
              message: "Person created successfully",
              data: {},
            });

          } else {
            await db.query('ROLLBACK');
            res.status(400).json({
              success: false,
              message: "No se pudo guardar.",
              data: {},
            })
          }
        } else {
          await db.query('ROLLBACK');
          res.status(400).json({
            success: false,
            message: "No se pudo guardar.",
            data: {},
          })
        }
      } else {
        await db.query('ROLLBACK');
        res.status(400).json({
          success: false,
          message: "No se pudo guardar.",
          data: {},
        });
      }

    } else {
      if ( verifCedula.rows[0].count > 0) {
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
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
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



module.exports = {
  getVoluntarios,
  getVoluntarioId,
  createVoluntario,
  updateVoluntario,
  deleteVoluntario,
  createVoluntariosBulk
};