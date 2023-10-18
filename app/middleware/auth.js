const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        const tokenDecoded = jwt.decode(token, process.env.SECRET_JWT);
        if (tokenDecoded) {
          if (Date.now() < tokenDecoded?.exp * 1000) {
            next();
          } else {
            throw new Error("No tiene permiso para acceder, Token vencido");
          }
        } else {
          throw new Error("No tiene permiso para acceder");
        }
      } else {
        throw new Error("No tiene permiso para acceder");
      }
    } else {
      throw new Error("No tiene permiso para acceder");
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: error.message || "Ocurrio un error.",
      data: null,
    });
  }
};

module.exports = checkAuth;
