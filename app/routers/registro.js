const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const {   createVoluntario,  createMinorVoluntario, verifySaveVoluntario } = require('../controllers/registro_voluntario/registro.controller');

//router.get('/', getVoluntarios);
router.get('/voluntario/verificar', checkAuth, verifySaveVoluntario);
router.post('/voluntario', checkAuth, createVoluntario);
//router.post('/voluntario/multi', createVoluntariosBulk);
router.post('/voluntario/menor', checkAuth, createMinorVoluntario);
//router.put('/:id', updateVoluntario);
//router.delete('/:id', deleteVoluntario);

module.exports = router;