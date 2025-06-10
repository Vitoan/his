const { Paciente } = require('../models');

const crearPaciente = async (req, res) => {
  const { nombre, apellido, dni, fechaNacimiento, email, telefono, direccion } = req.body;

  try {
    const nuevoPaciente = await Paciente.create({
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      email,
      telefono,
      direccion
    });

    res.status(201).json({
      mensaje: 'Paciente creado correctamente',
      paciente: nuevoPaciente
    });
  } catch (error) {
    console.error('❌ Error al crear paciente:', error);
    res.status(500).json({
      error: 'Error al crear paciente',
      detalle: error.message
    });
  }
};

module.exports = { crearPaciente };
