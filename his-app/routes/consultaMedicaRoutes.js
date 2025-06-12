const express = require('express');
const router = express.Router();
const {
  crearConsulta,
  obtenerConsultas,
  obtenerConsultaPorId,
  obtenerConsultasPorMedico
} = require('../controllers/consultaMedicaController');

router.post('/', crearConsulta);
router.get('/', obtenerConsultas);
router.get('/:id', obtenerConsultaPorId);
router.get('/medico/:medicoId', obtenerConsultasPorMedico);

module.exports = router;
