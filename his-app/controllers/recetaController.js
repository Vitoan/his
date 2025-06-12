const { Receta } = require('../models');

exports.crearReceta = async (req, res) => {
  try {
    const { consultaMedicaId, medicamento, indicaciones } = req.body;
    const nuevaReceta = await Receta.create({ consultaMedicaId, medicamento, indicaciones });
    res.status(201).json(nuevaReceta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la receta', detalle: error.message });
  }
};

exports.obtenerRecetas = async (req, res) => {
  try {
    const recetas = await Receta.findAll();
    res.status(200).json(recetas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las recetas', detalle: error.message });
  }
};

exports.obtenerRecetaPorId = async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });
    res.status(200).json(receta);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la receta', detalle: error.message });
  }
};

exports.actualizarReceta = async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });

    await receta.update(req.body);
    res.status(200).json({ mensaje: 'Receta actualizada correctamente', receta });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la receta', detalle: error.message });
  }
};

exports.eliminarReceta = async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });

    await receta.destroy();
    res.status(200).json({ mensaje: 'Receta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la receta', detalle: error.message });
  }
};
