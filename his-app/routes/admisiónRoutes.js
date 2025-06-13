const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    mensaje: 'Módulo de Admisión y Recepción activo',
    endpoints: {
      pacientes: '/pacientes',
      turnos: '/turnos',
      medicos: '/medicos',
      consultas: '/consultas-medicas'
    }
  });
});

module.exports = router;