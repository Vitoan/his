const express = require('express');
const router = express.Router();

const { crearTurno, obtenerTurnos, obtenerTurnoPorId, actualizarTurno, eliminarTurno } = require('../controllers/turnoController');router.post('/', crearTurno);
router.get('/', obtenerTurnos);
router.get('/:id', obtenerTurnoPorId);
router.put('/:id', actualizarTurno);
router.delete('/:id', eliminarTurno);


module.exports = router;
