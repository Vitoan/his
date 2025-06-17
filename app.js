// app.js
// Este archivo configura y arranca la aplicación Express.
// Define middlewares, rutas y el manejo de errores.

const express = require('express');
const app = express();
const path = require('path'); // Módulo 'path' para trabajar con rutas de archivos y directorios
require('dotenv').config(); // Carga las variables de entorno del archivo .env

// Importar rutas específicas para el módulo de pacientes/admisión
// Se asume que 'pacienteRoutes.js' está en la carpeta 'routes/'
const pacienteRoutes = require('./routes/pacienteRoutes');
// Importar el controlador de pacientes directamente para usarlo en app.get('/pacientes/lista')
const pacienteController = require('./controllers/pacienteController');


// --- Middlewares Globales ---
// Estos middlewares se aplican a todas las solicitudes entrantes.

// Middleware para parsear datos de formularios HTML (application/x-www-form-urlencoded)
// Permite acceder a los datos enviados por formularios a través de req.body
app.use(express.urlencoded({ extended: true }));

// Middleware para parsear solicitudes con cuerpo JSON (application/json)
// Útil si se envían datos JSON desde el frontend (ej. con fetch o axios)
app.use(express.json());

// --- Configuración del Motor de Plantillas PUG ---
// Establece Pug como el motor de vistas de la aplicación.
app.set('view engine', 'pug');

// Define el directorio donde Express buscará los archivos de las vistas (.pug).
// 'path.join(__dirname, 'views')' asegura que la ruta sea correcta
// independientemente del sistema operativo o dónde se ejecute la app.
app.set('views', path.join(__dirname, 'views'));

// --- Servir Archivos Estáticos ---
// Configura Express para servir archivos estáticos (CSS, JavaScript del cliente, imágenes).
// La carpeta 'public' se hace accesible directamente desde la raíz del servidor.
// Por ejemplo, 'public/css/style.css' será accesible como '/css/style.css'.
app.use(express.static(path.join(__dirname, 'public')));


// --- Definición de Rutas ---

// Ruta de inicio (raíz del sitio): Sirve la página de bienvenida.
// Cuando el usuario accede a http://localhost:3000/, se renderiza 'bienvenida.pug'.
app.get('/', (req, res) => {
    res.render('bienvenida', { title: 'Bienvenido al HIS' });
});

// Monta las rutas relacionadas con el módulo de admisión bajo el prefijo '/admision'.
// Esto significa que un 'router.get('/')' en pacienteRoutes.js se convierte en 'GET /admision/'.
// Un 'router.get('/exito')' se convierte en 'GET /admision/exito'.
app.use('/admision', pacienteRoutes);

// La ruta para listar pacientes se define aquí explícitamente.
// Esto evita la duplicidad de montajes o conflictos que surgían al usar
// 'app.use('/pacientes', pacienteRoutes);' junto con 'app.use('/admision', pacienteRoutes);'.
app.get('/pacientes/lista', pacienteController.listarPacientes);


// --- Manejo de Errores ---

// Middleware para manejar rutas no encontradas (error 404).
// Se ejecuta si ninguna de las rutas definidas anteriormente coincide con la solicitud.
app.use((req, res, next) => {
    res.status(404).render('error', { title: 'Página No Encontrada', message: 'Lo sentimos, la página que buscas no existe.' });
});

// Middleware centralizado para manejar errores generales del servidor (error 500).
// Captura cualquier error que ocurra durante el procesamiento de las solicitudes.
app.use((err, req, res, next) => {
    console.error(err.stack); // Registra el stack de error completo para depuración.
    res.status(500).render('error', { title: 'Error del Servidor', message: 'Ha ocurrido un error interno en el servidor. Por favor, inténtalo de nuevo más tarde.' });
});

// --- Inicio del Servidor ---
// Obtiene el puerto del entorno (si está definido) o usa 3000 por defecto.
const PORT = process.env.PORT || 3000;

// Inicia el servidor Express y lo pone a escuchar en el puerto especificado.
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`🌐 URL para la Página de Bienvenida: http://localhost:${PORT}`);
    console.log(`🌐 URL para el módulo de Admisión: http://localhost:${PORT}/admision`);
    console.log(`🌐 URL para la Lista de Pacientes: http://localhost:${PORT}/pacientes/lista`);
});
