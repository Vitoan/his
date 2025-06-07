const Usuario = require('../models/Usuario');

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rol
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
};
