const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta POST /usuarios
router.post('/', usuarioController.crearUsuario);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.put('/:id', usuarioController.actualizarUsuario);

module.exports = router;
