// routes/medicoRoutes.js
const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

// Ruta para crear un médico
router.post('/', medicoController.crearMedico);

// Ruta para obtener todos los médicos
router.get('/', medicoController.obtenerMedicos);

// Ruta para obtener un médico por id
router.get('/:id', medicoController.obtenerMedico);

// Ruta para actualizar un médico
router.put('/:id', medicoController.actualizarMedico);

// Ruta para eliminar un médico
router.delete('/:id', medicoController.eliminarMedico);

module.exports = router;
