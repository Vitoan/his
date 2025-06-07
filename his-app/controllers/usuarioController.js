const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {
  try {
    // Por ahora podés solo imprimir los datos
    console.log(req.body);
    res.status(201).json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
