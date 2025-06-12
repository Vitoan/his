const { EstudioMedico } = require('../models');

exports.crearEstudio = async (req, res) => {
  try {
    const estudio = await EstudioMedico.create(req.body);
    res.status(201).json(estudio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el estudio médico', detalle: error.message });
  }
};

exports.obtenerEstudios = async (req, res) => {
  try {
    const estudios = await EstudioMedico.findAll();
    res.json(estudios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los estudios médicos', detalle: error.message });
  }
};

exports.obtenerEstudioPorId = async (req, res) => {
  try {
    const estudio = await EstudioMedico.findByPk(req.params.id);
    if (estudio) {
      res.json(estudio);
    } else {
      res.status(404).json({ error: 'Estudio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el estudio', detalle: error.message });
  }
};

exports.actualizarEstudio = async (req, res) => {
  try {
    const estudio = await EstudioMedico.findByPk(req.params.id);
    if (estudio) {
      await estudio.update(req.body);
      res.json(estudio);
    } else {
      res.status(404).json({ error: 'Estudio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estudio', detalle: error.message });
  }
};

exports.eliminarEstudio = async (req, res) => {
  try {
    const estudio = await EstudioMedico.findByPk(req.params.id);
    if (estudio) {
      await estudio.destroy();
      res.json({ mensaje: 'Estudio eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Estudio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el estudio', detalle: error.message });
  }
};
