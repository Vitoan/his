const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

router.post('/', medicoController.crearMedico);
router.get('/', medicoController.obtenerMedicos);

module.exports = router;
