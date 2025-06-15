const { Admision, Paciente, Turno } = require('../models');

exports.crearAdmision = async (req, res) => {
  try {
    const nueva = await Admision.create(req.body);
    res.json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear admisión', detalle: error.message });
  }
};

exports.listarAdmisiones = async (req, res) => {
  try {
    const admisiones = await Admision.findAll({
      include: [Paciente, Turno]
    });
    res.json(admisiones);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar admisiones', detalle: error.message });
  }
};

exports.obtenerAdmision = async (req, res) => {
  try {
    const admision = await Admision.findByPk(req.params.id);
    if (admision) res.json(admision);
    else res.status(404).json({ error: 'Admisión no encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener admisión', detalle: error.message });
  }
};

exports.actualizarAdmision = async (req, res) => {
  try {
    const admision = await Admision.findByPk(req.params.id);
    if (!admision) return res.status(404).json({ error: 'No encontrada' });
    await admision.update(req.body);
    res.json(admision);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
  }
};

exports.eliminarAdmision = async (req, res) => {
  try {
    const filas = await Admision.destroy({ where: { id: req.params.id } });
    if (filas > 0) res.json({ mensaje: 'Admisión eliminada' });
    else res.status(404).json({ error: 'No encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar', detalle: error.message });
  }
};

exports.vistaListarAdmisiones = async (req, res) => {
  try {
    const admisiones = await Admision.findAll({
      include: [Paciente, Turno]
    });
    res.render('admision/lista', { admisiones });
  } catch (error) {
    console.error('ERROR en vistaListarAdmisiones:', error.message);
    res.status(500).send('Error al renderizar vista');
  }
};