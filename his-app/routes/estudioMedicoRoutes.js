const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioMedicoController');

router.post('/estudios', estudioController.crearEstudio);
router.get('/estudios', estudioController.obtenerEstudios);
router.get('/estudios/:id', estudioController.obtenerEstudioPorId);
router.put('/estudios/:id', estudioController.actualizarEstudio);
router.delete('/estudios/:id', estudioController.eliminarEstudio);

module.exports = router;
