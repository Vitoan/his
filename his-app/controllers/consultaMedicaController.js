const { ConsultaMedica, Turno } = require('../models');

const crearConsulta = async (req, res) => {
  try {
    const { fechaHora, diagnostico, tratamiento, turnoId } = req.body;

    // Verificar que el turno exista
    const turno = await Turno.findByPk(turnoId);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    const consulta = await ConsultaMedica.create({
      fechaHora,
      diagnostico,
      tratamiento,
      turnoId
    });

    res.status(201).json(consulta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear consulta', detalle: error.message });
  }
};

const obtenerConsultas = async (req, res) => {
  try {
    const consultas = await ConsultaMedica.findAll();
    res.json(consultas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener consultas' });
  }
};

const obtenerConsultaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = await ConsultaMedica.findByPk(id);
    if (!consulta) {
      return res.status(404).json({ error: 'Consulta no encontrada' });
    }
    res.json(consulta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la consulta' });
  }
};
const obtenerConsultasPorMedico = async (req, res) => {
  try {
    const { medicoId } = req.params;

    const consultas = await ConsultaMedica.findAll({
      include: {
        model: Turno,
        where: { medicoId }
      }
    });

    res.json(consultas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las consultas del médico', detalle: error.message });
  }
};

module.exports = {
  crearConsulta,
  obtenerConsultas,
  obtenerConsultaPorId,
  obtenerConsultasPorMedico
};
