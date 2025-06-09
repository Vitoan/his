const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta POST /usuarios
router.post('/', usuarioController.crearUsuario);
router.get('/', usuarioController.obtenerUsuarios);
module.exports = router;
