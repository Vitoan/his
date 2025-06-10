const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.post('/', pacienteController.crearPaciente);
router.get('/', pacienteController.obtenerPacientes);
router.put('/:id', pacienteController.actualizarPaciente);
router.delete('/:id', pacienteController.eliminarPaciente);
router.get('/dni/:dni', pacienteController.buscarPorDNI);

module.exports = router;