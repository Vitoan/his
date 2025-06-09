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

    res.status(201).json({
  mensaje: 'Usuario creado exitosamente',
  usuario: {
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    apellido: nuevoUsuario.apellido,
    email: nuevoUsuario.email,
    rol: nuevoUsuario.rol,
    createdAt: nuevoUsuario.createdAt,
    updatedAt: nuevoUsuario.updatedAt
  }
});
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({
      error: 'Error al crear usuario',
      detalle: error.message
    });
  }
};
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'apellido', 'email', 'rol', 'createdAt', 'updatedAt']
    });

    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({
      error: 'Error al obtener usuarios',
      detalle: error.message
    });
  }
};
const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'apellido', 'email', 'rol', 'createdAt', 'updatedAt']
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({
      error: 'Error al obtener usuario',
      detalle: error.message
    });
  }
};

module.exports = { crearUsuario , obtenerUsuarios, obtenerUsuarioPorId };