const { EstudioMedico } = require('../models');

module.exports = {
  async crear(req, res) {
    try {
      const estudio = await EstudioMedico.create(req.body);
      res.status(201).json(estudio);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el estudio', detalle: error.message });
    }
  },

  async listar(req, res) {
    try {
      const estudios = await EstudioMedico.findAll();
      res.json(estudios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estudios', detalle: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const estudio = await EstudioMedico.findByPk(req.params.id);
      if (!estudio) return res.status(404).json({ error: 'Estudio no encontrado' });
      res.json(estudio);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar estudio', detalle: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const estudio = await EstudioMedico.findByPk(req.params.id);
      if (!estudio) return res.status(404).json({ error: 'Estudio no encontrado' });

      await estudio.update(req.body);
      res.json(estudio);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar estudio', detalle: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const estudio = await EstudioMedico.findByPk(req.params.id);
      if (!estudio) return res.status(404).json({ error: 'Estudio no encontrado' });

      await estudio.destroy();
      res.json({ mensaje: 'Estudio eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar estudio', detalle: error.message });
    }
  }
};
