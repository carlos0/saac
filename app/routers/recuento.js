const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const { getDatosSectores } = require('../controllers/recuento_preliminar/recuento.controller');

router.get('/sectores', checkAuth, getDatosSectores);

module.exports = router;