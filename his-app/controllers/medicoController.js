const { Medico } = require('../models');

const crearMedico = async (req, res) => {
  try {
    const nuevoMedico = await Medico.create(req.body);
    res.status(201).json(nuevoMedico);
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear médico',
      detalle: error.message
    });
  }
};

const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    res.json(medicos);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener médicos',
      detalle: error.message
    });
  }
};

module.exports = {
  crearMedico,
  obtenerMedicos
};
