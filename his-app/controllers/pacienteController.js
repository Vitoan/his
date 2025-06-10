const { Paciente } = require('../models');

const crearPaciente = async (req, res) => {
  try {
    const nuevoPaciente = await Paciente.create(req.body);
    res.status(201).json({
      mensaje: 'Paciente creado exitosamente',
      paciente: nuevoPaciente
    });
  } catch (error) {
    console.error('❌ Error al crear paciente:', error);
    res.status(500).json({
      error: 'Error al crear paciente',
      detalle: error.message
    });
  }
};

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

module.exports = {
  crearPaciente,
  obtenerPacientes
};

