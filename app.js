const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config(); // Carga las variables de entorno

// Importar rutas
const pacienteRoutes = require('./routes/pacienteRoutes'); // Asegúrate que esta ruta sea correcta

// Middlewares para parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Para formularios HTML (application/x-www-form-urlencoded)
app.use(express.json()); // Para solicitudes con cuerpo JSON (application/json)

// Configuración del motor de plantillas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Esto debe apuntar a la carpeta 'views' correcta

// Sirve archivos estáticos (CSS, imágenes, JS del lado del cliente)
app.use(express.static(path.join(__dirname, 'public')));

// --- Definición de Rutas ---

// Ruta de inicio del módulo de admisión y recepción
// Cuando se accede a la raíz del sitio, redirige al formulario de admisión
app.get('/', (req, res) => {
    res.redirect('/admision');
});

// Usa las rutas definidas en pacienteRoutes.js
// Todas las rutas dentro de pacienteRoutes.js serán prefijadas con '/admision' o '/pacientes'
app.use('/admision', pacienteRoutes);
app.use('/pacientes', pacienteRoutes); // También para la lista de pacientes, etc.

// --- Manejo de Errores ---

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).render('error', { title: 'Página No Encontrada', message: 'Lo sentimos, la página que buscas no existe.' });
});

// Middleware centralizado para manejar errores generales del servidor (500)
app.use((err, req, res, next) => {
    console.error(err.stack); // Loguea el stack del error para depuración
    res.status(500).render('error', { title: 'Error del Servidor', message: 'Ha ocurrido un error interno en el servidor. Por favor, inténtalo de nuevo más tarde.' });
});

// --- Inicio del Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`🌐 URL para el módulo de Admisión: http://localhost:${PORT}/admision`);
});