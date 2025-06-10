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

module.exports = {
  crearTurno,
  obtenerTurnos
};
