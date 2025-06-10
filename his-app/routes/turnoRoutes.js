const express = require('express');
const router = express.Router();

const { crearTurno, obtenerTurnos, actualizarTurno, eliminarTurno } = require('../controllers/turnoController');

router.post('/', crearTurno);
router.get('/', obtenerTurnos);
router.put('/:id', actualizarTurno);
router.delete('/:id', eliminarTurno);

module.exports = router;
