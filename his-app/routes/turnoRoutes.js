const express = require('express');
const router = express.Router();

const { crearTurno, obtenerTurnos, obtenerTurnoPorId, actualizarTurno, eliminarTurno, obtenerTurnosPorPaciente, obtenerTurnosPorMedico} = require('../controllers/turnoController');router.post('/', crearTurno);
router.get('/', obtenerTurnos);
router.get('/:id', obtenerTurnoPorId);
router.get('/paciente/:pacienteId', obtenerTurnosPorPaciente);
router.get('/medico/:medicoId', obtenerTurnosPorMedico);
router.put('/:id', actualizarTurno);
router.delete('/:id', eliminarTurno);


module.exports = router;
