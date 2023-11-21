const jwt = require('jsonwebtoken')
const db = require('../../../config/db')

const login = async (req, res) => {
  try {
    const users = {
      nombre: "SAAC YO CENSo",
      inicial: "SYC",
      tipo_usuario: "EMAIL SENDER",
      grupo: "EMAIL SENDER",
      correo: "yocenso@ine.gob.bo",
      statusCode: 200,
    }

    const token = await jwt.sign(users, process.env.SECRET_JWT, { expiresIn: '365d' })

    const respuesta = {
      users,
      token
    }
    res.json({
      token: respuesta.token,
      users: respuesta.users
    })
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