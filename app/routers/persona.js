const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const { getPersona, getPersonaId, createPersona, updatePersona, deletePerson, createPersonaBulk } = require('../controllers/persona/persona.controller');

router.get('/', getPersona);
router.get('/:id', getPersonaId);
router.post('/', createPersona);
router.post('/multi', createPersonaBulk);
router.put('/:id', updatePersona);
router.delete('/:id', deletePerson);

module.exports = router;