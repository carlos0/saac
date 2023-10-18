const jwt = require('jsonwebtoken')
const db = require('../../../config/db')

const login = async (req, res) => {
  try {
    const { usuario, clave } = req.body;
    const data = await db.query(`
        SELECT * 
        FROM seguridad.usuario
        WHERE usuario = '${usuario}' AND clave_literal = '${clave}' AND estado_usuario = 'ACTIVO' `);
    let dataUser = data.rows;
    dataUser = dataUser[0];
    if (!dataUser) {
      let err = new Error('El usuario no se encontro.');
      err.code = 404;
      throw err
    }
    const datos_token = {
      id_usuario: dataUser.id_usuario,
      nombre: `${dataUser.nombres} ${dataUser.apellido_paterno} ${dataUser.apellido_materno}`,
      zona: dataUser.id_zona_censal
    }

    const token = await jwt.sign(datos_token, process.env.SECRET_JWT, { expiresIn: '8h' })

    const respuesta = {
      id_usuario: dataUser.id_usuario,
      nombre: `${dataUser.nombres} ${dataUser.apellido_paterno} ${dataUser.apellido_materno}`,
      zona: dataUser.id_zona_censal,
      menu: [],
      token
    }

    res.status(200).json({
      success: true,
      message: 'Usuario encontrado',
      data: respuesta
    });
  } catch (error) {
    res.status(error.code || 500).json({ 
      success: false,
      message: error.message || 'Ocurrio un error',
      data: {}
    })
  }
}

module.exports = {
  login,
}