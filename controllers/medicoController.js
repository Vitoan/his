// controllers/medicoController.js
const { Medico } = require('../models');

const crearMedico = async (req, res) => {
  const { nombre, apellido, especialidad, email, telefono } = req.body;

  try {
    const nuevoMedico = await Medico.create({
      nombre,
      apellido,
      especialidad,
      email,
      telefono
    });

    res.status(201).json({
      mensaje: 'Médico creado exitosamente',
      medico: nuevoMedico
    });
  } catch (error) {
    console.error('❌ Error al crear médico:', error);
    res.status(500).json({
      error: 'Error al crear médico',
      detalle: error.message
    });
  }
};

const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    res.status(200).json(medicos);
  } catch (error) {
    console.error('❌ Error al obtener médicos:', error);
    res.status(500).json({
      error: 'Error al obtener médicos',
      detalle: error.message
    });
  }
};

const obtenerMedico = async (req, res) => {
  const { id } = req.params;

  try {
    const medico = await Medico.findByPk(id);

    if (!medico) {
      return res.status(404).json({
        error: 'Médico no encontrado'
      });
    }

    res.status(200).json(medico);
  } catch (error) {
    console.error('❌ Error al obtener médico:', error);
    res.status(500).json({
      error: 'Error al obtener médico',
      detalle: error.message
    });
  }
};

const actualizarMedico = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, especialidad, email, telefono } = req.body;

  try {
    const medico = await Medico.findByPk(id);

    if (!medico) {
      return res.status(404).json({
        error: 'Médico no encontrado'
      });
    }

    await medico.update({
      nombre,
      apellido,
      especialidad,
      email,
      telefono
    });

    res.status(200).json({
      mensaje: 'Médico actualizado exitosamente',
      medico
    });
  } catch (error) {
    console.error('❌ Error al actualizar médico:', error);
    res.status(500).json({
      error: 'Error al actualizar médico',
      detalle: error.message
    });
  }
};

const eliminarMedico = async (req, res) => {
  const { id } = req.params;

  try {
    const medico = await Medico.findByPk(id);

    if (!medico) {
      return res.status(404).json({
        error: 'Médico no encontrado'
      });
    }

    await medico.destroy();

    res.status(200).json({
      mensaje: 'Médico eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar médico:', error);
    res.status(500).json({
      error: 'Error al eliminar médico',
      detalle: error.message
    });
  }
};

module.exports = {
  crearMedico,
  obtenerMedicos,
  obtenerMedico,
  actualizarMedico,
  eliminarMedico
};
