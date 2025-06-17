const express = require('express');
const router = express.Router();
const controlador = require('../controllers/diagnosticoController');

router.post('/', controlador.crearDiagnostico);
router.get('/', controlador.obtenerDiagnosticos);

module.exports = router;
