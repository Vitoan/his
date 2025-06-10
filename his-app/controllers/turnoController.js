const { Turno, Paciente, Medico } = require('../models');

const crearTurno = async (req, res) => {
  const { fecha, hora, pacienteId, medicoId } = req.body;

  try {
    // Verificar existencia del paciente
    const pacienteExiste = await Paciente.findByPk(pacienteId);
    if (!pacienteExiste) {
      return res.status(400).json({ error: `Paciente con ID ${pacienteId} no existe.` });
    }

    // Verificar existencia del médico
    const medicoExiste = await Medico.findByPk(medicoId);
    if (!medicoExiste) {
      return res.status(400).json({ error: `Médico con ID ${medicoId} no existe.` });
    }

    // Crear turno si todo es válido
    const nuevoTurno = await Turno.create({ fecha, hora, pacienteId, medicoId });

    res.status(201).json({
      mensaje: 'Turno creado exitosamente',
      turno: nuevoTurno
    });
  } catch (error) {
    console.error('❌ Error al crear turno:', error);
    res.status(500).json({
      error: 'Error al crear turno',
      detalle: error.message
    });
  }
};

const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [
        { model: Paciente, attributes: ['nombre', 'apellido'] },
        { model: Medico, attributes: ['nombre', 'apellido'] }
      ]
    });

    res.json(turnos);
  } catch (error) {
    console.error('❌ Error al obtener turnos:', error);
    res.status(500).json({
      error: 'Error al obtener turnos',
      detalle: error.message
    });
  }
};
const actualizarTurno = async (req, res) => {
  const { id } = req.params;
  const { fecha, hora, pacienteId, medicoId } = req.body;

  try {
    // Verificar que el turno exista
    const turno = await Turno.findByPk(id);
    if (!turno) {
      return res.status(404).json({ error: `No se encontró el turno con ID ${id}` });
    }

    // Validar paciente
    if (pacienteId) {
      const pacienteExiste = await Paciente.findByPk(pacienteId);
      if (!pacienteExiste) {
        return res.status(400).json({ error: `Paciente con ID ${pacienteId} no existe.` });
      }
    }

    // Validar médico
    if (medicoId) {
      const medicoExiste = await Medico.findByPk(medicoId);
      if (!medicoExiste) {
        return res.status(400).json({ error: `Médico con ID ${medicoId} no existe.` });
      }
    }

    // Actualizar turno
    await turno.update({ fecha, hora, pacienteId, medicoId });

    res.json({
      mensaje: 'Turno actualizado correctamente',
      turno
    });
  } catch (error) {
    console.error('❌ Error al actualizar turno:', error);
    res.status(500).json({
      error: 'Error al actualizar turno',
      detalle: error.message
    });
  }
};


module.exports = {
  crearTurno,
  obtenerTurnos,
  actualizarTurno
};
