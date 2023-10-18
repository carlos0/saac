const db = require("../../../config/db");
const pgp = require('pg-promise')({
    capSQL: true,
    schema: 'persona'
});

const db2 = pgp({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

const getPersona = async (req, res) => {
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

const getPersonaId = async(req, res) => {
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

const createPersonaBulk = async(req, res) => {
  const data = req.body;
  console.log('data :', data);
  try {
    await db2.query('BEGIN');
    const cs = new pgp.helpers.ColumnSet(['cedula_identidad', 'nombres', 'apellidos', 'celular', 'fecha_nacimiento'], {table: 'persona'},);
    const query = pgp.helpers.insert(data, cs);
    const dataPersonas = await db2.query(query);
    if (dataPersonas) {
      await db2.query('COMMIT')
      res.status(200).json({
        success: true,
        message: "Person created successfully",
        data: {},
      });
    }
  } catch (error) {
    await db2.query('ROLLBACK');
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: {},
    });
  }
}

const createPersona = async(req, res) => {
  const persona = req.body;
  try {
    await db.query('BEGIN');
    const dataPersona = await db.query(`
        INSERT INTO persona.persona (cedula_identidad, nombres, apellidos, celular, fecha_nacimiento) 
        VALUES ($1, $2, $3, $4, $5 )`, [persona.cedula_identidad, persona.nombres, persona.apellidos, persona.celular, persona.fecha_nacimiento]);
    if (dataPersona) {
      await db.query('COMMIT')
      res.status(200).json({
        success: true,
        message: "Person created successfully",
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

const updatePersona = async(req, res) => {
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

const deletePerson = async(req, res) => {
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
  getPersona,
  getPersonaId,
  createPersona,
  updatePersona,
  deletePerson,
  createPersonaBulk
};