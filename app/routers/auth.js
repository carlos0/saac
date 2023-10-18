const express = require('express');
const router = express.Router();

const { login } = require('../controllers/autenticacion/auth.controller');

router.post('/login', login);

module.exports = router;