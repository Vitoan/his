const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

const crearUsuario = async (req, res) => {
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({
      error: 'Error al crear usuario',
      detalle: error.message
    });
  }
};

module.exports = { crearUsuario };