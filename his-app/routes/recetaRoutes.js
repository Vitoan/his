const express = require('express');
const router = express.Router();
const {
  crearReceta,
  obtenerRecetasPorConsulta
} = require('../controllers/recetaController');

router.post('/', crearReceta);
router.get('/consulta/:consultaId', obtenerRecetasPorConsulta);

module.exports = router;
