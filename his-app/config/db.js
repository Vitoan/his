// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'his_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba la conexión al iniciar la aplicación
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.stack);
        // Mensajes más descriptivos para errores comunes de conexión
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión a la base de datos se cerró inesperadamente.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Demasiadas conexiones a la base de datos. Ajusta connectionLimit.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Conexión a la base de datos rechazada. Asegúrate de que MySQL esté corriendo y las credenciales sean correctas.');
        } else {
            console.error('Error desconocido al conectar a la base de datos:', err.message);
        }
        process.exit(1); // Sale de la aplicación si no puede conectar a la DB
    }
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    connection.release();
});

module.exports = pool.promise(); // Exporta el pool con la interfaz de promesas