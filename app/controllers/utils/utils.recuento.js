const jwt = require('jsonwebtoken')

const getDataToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const tokenDecoded = jwt.decode(token, process.env.SECRET_JWT);
  return tokenDecoded.usuario;
}

module.exports = {
  getDataToken
}