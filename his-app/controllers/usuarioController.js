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
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si viene una nueva contraseña, la hasheamos
    let nuevaPassword = usuario.password; // contraseña actual por defecto
    if (password) {
      nuevaPassword = await bcrypt.hash(password, 10);
    }

    // Actualizamos los datos
    await usuario.update({
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      email: email || usuario.email,
      password: nuevaPassword,
      rol: rol || usuario.rol
    });

    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({
      error: 'Error al actualizar usuario',
      detalle: error.message
    });
  }
};
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({
      error: 'Error al eliminar usuario',
      detalle: error.message
    });
  }
};
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  // Validar que se envíen ambos campos
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Si todo va bien, simular "inicio de sesión"
    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



module.exports = { crearUsuario , obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario, loginUsuario };
// Exportamos las funciones del controlador para ser utilizadas en las rutas