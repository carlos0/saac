const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const { getVoluntarios, getVoluntarioId, createVoluntario, updateVoluntario, deleteVoluntario, createVoluntariosBulk } = require('../controllers/registro_voluntario/registro.controller');

router.get('/', getVoluntarios);
router.get('/:id', getVoluntarioId);
router.post('/voluntario', createVoluntario);
router.post('/voluntario/multi', createVoluntariosBulk);
router.put('/:id', updateVoluntario);
router.delete('/:id', deleteVoluntario);

module.exports = router;