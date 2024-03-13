const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const { obtenerDatosJornada, actualizarRegistro, registroDeIncidencias, obtenerDatosParaReportes } = require('../controllers/jornada_censal/jornada.controller');

router.get('/info', checkAuth, obtenerDatosJornada);
router.put('/actualizar/:id', checkAuth, actualizarRegistro);
router.put('/incidente/:id', checkAuth, registroDeIncidencias);
router.get('/reporte', checkAuth, obtenerDatosParaReportes);

module.exports = router;