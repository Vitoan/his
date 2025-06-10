const { Especialidad } = require('../models');

// Crear una especialidad
exports.crearEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.create(req.body);
    res.status(201).json(especialidad);
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear especialidad',
      detalle: error.message
    });
  }
};

// Obtener todas las especialidades
exports.obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll();
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener especialidades',
      detalle: error.message
    });
  }
};

// Obtener una especialidad por ID
exports.obtenerEspecialidadPorId = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }
    res.json(especialidad);
  } catch (error) {
    res.status(500).json({
      error: 'Error al buscar especialidad',
      detalle: error.message
    });
  }
};

// Actualizar una especialidad
exports.actualizarEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }
    await especialidad.update(req.body);
    res.json(especialidad);
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar especialidad',
      detalle: error.message
    });
  }
};

// Eliminar una especialidad
exports.eliminarEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) {
      return res.status(404).json({ error: 'Especialidad no encontrada' });
    }
    await especialidad.destroy();
    res.json({ mensaje: 'Especialidad eliminada' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar especialidad',
      detalle: error.message
    });
  }
};
