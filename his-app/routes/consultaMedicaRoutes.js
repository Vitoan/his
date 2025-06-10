const express = require('express');
const router = express.Router();
const {
  crearConsulta,
  obtenerConsultas,
  obtenerConsultaPorId
} = require('../controllers/consultaMedicaController');

router.post('/', crearConsulta);
router.get('/', obtenerConsultas);
router.get('/:id', obtenerConsultaPorId);

module.exports = router;
