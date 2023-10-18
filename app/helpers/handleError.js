const httpError = (res, err) => {
  console.log(err);
  res.status(500);
  res.send({ error: "Error del Servidor!." });
};

module.exports = { httpError };
