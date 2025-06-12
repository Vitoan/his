const { Diagnostico } = require('../models');

exports.crearDiagnostico = async (req, res) => {
  try {
    const nuevo = await Diagnostico.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el diagnóstico',
      detalle: error.message
    });
  }
};

exports.obtenerDiagnosticos = async (req, res) => {
  try {
    const lista = await Diagnostico.findAll();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener diagnósticos' });
  }
};
