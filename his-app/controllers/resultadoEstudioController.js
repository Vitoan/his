const { ResultadoEstudio } = require('../models');

module.exports = {
  async crear(req, res) {
    try {
      const { estudioMedicoId, descripcion, archivoSimulado } = req.body;
      const resultado = await ResultadoEstudio.create({ estudioMedicoId, descripcion, archivoSimulado });
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear resultado', detalle: error.message });
    }
  },

  async listar(req, res) {
    try {
      const resultados = await ResultadoEstudio.findAll();
      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar', detalle: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const resultado = await ResultadoEstudio.findByPk(req.params.id);
      resultado
        ? res.json(resultado)
        : res.status(404).json({ error: 'Resultado no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error', detalle: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const { descripcion, archivoSimulado } = req.body;
      const resultado = await ResultadoEstudio.findByPk(req.params.id);
      if (!resultado) return res.status(404).json({ error: 'No encontrado' });

      await resultado.update({ descripcion, archivoSimulado });
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const resultado = await ResultadoEstudio.findByPk(req.params.id);
      if (!resultado) return res.status(404).json({ error: 'No encontrado' });

      await resultado.destroy();
      res.json({ mensaje: 'Eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar', detalle: error.message });
    }
  }
};
