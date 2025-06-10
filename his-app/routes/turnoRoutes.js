const express = require('express');
const router = express.Router();

const { crearTurno, obtenerTurnos, actualizarTurno } = require('../controllers/turnoController');

router.post('/', crearTurno);
router.get('/', obtenerTurnos);
router.put('/:id', actualizarTurno);

module.exports = router;
