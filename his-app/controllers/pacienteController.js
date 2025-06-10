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
const actualizarPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Paciente.findByPk(id);

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    await paciente.update(req.body);

    res.json({
      mensaje: 'Paciente actualizado correctamente',
      paciente
    });
  } catch (error) {
    console.error('❌ Error al actualizar paciente:', error);
    res.status(500).json({ error: 'Error al actualizar paciente' });
  }
};
const eliminarPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Paciente.findByPk(id);

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    await paciente.destroy();

    res.json({ mensaje: 'Paciente eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar paciente:', error);
    res.status(500).json({ error: 'Error al eliminar paciente' });
  }
};
const buscarPorDNI = async (req, res) => {
  const { dni } = req.params;

  try {
    const paciente = await Paciente.findOne({ where: { dni } });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('❌ Error al buscar paciente:', error);
    res.status(500).json({ error: 'Error al buscar paciente por DNI' });
  }
};




module.exports = {
  crearPaciente,
  obtenerPacientes,
  actualizarPaciente,
  eliminarPaciente,
  buscarPorDNI
};

