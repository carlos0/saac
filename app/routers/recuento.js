const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const { getDatosSectores, guardarDatosRecuento } = require('../controllers/recuento_preliminar/recuento.controller');

router.get('/sectores', checkAuth, getDatosSectores);
router.post('/', checkAuth, guardarDatosRecuento);

module.exports = router;