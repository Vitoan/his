const { Receta } = require('../models');

const crearReceta = async (req, res) => {
  try {
    const receta = await Receta.create(req.body);
    res.status(201).json(receta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la receta', detalle: error.message });
  }
};

const obtenerRecetasPorConsulta = async (req, res) => {
  try {
    const { consultaId } = req.params;
    const recetas = await Receta.findAll({ where: { consultaMedicaId: consultaId } });
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recetas', detalle: error.message });
  }
};

module.exports = {
  crearReceta,
  obtenerRecetasPorConsulta
};
