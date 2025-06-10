const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Crear paciente
router.post('/', pacienteController.crearPaciente);

module.exports = router;
