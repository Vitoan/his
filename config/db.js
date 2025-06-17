// config/db.js
/**
 * Configuración y manejo de la conexión a la base de datos MySQL usando mysql2/promise.
 * Este módulo crea un pool de conexiones, inicializa el esquema de la base de datos
 * y proporciona funciones para interactuar con la base de datos.
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs/promises');
const path = require('path');

dotenv.config();

// Configuración del pool de conexiones
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'his_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Crea el pool de conexiones
const pool = mysql.createPool(poolConfig);

/**
 * Obtiene una conexión del pool.
 * @returns {Promise<PoolConnection>} Conexión del pool.
 * @throws {Error} Si no se puede obtener la conexión.
 */
async function getConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos obtenida del pool.');
    return connection;
  } catch (error) {
    console.error('❌ Error al obtener conexión del pool:', error.message);
    throw error;
  }
}

/**
 * Inicializa el esquema de la base de datos ejecutando el archivo db.sql.
 * Advertencia: Esto elimina y recrea las tablas, perdiendo datos existentes.
 * Úsalo solo en entornos de desarrollo o pruebas, no en producción.
 */
async function initializeDatabaseSchema() {
  let connection;
  try {
    connection = await getConnection();
    const sqlFilePath = path.join(__dirname, '..', 'db.sql');
    const sql = await fs.readFile(sqlFilePath, 'utf8');

    // Divide el script SQL en sentencias individuales
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log('⏳ Inicializando esquema de la base de datos...');
    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log('✅ Esquema de la base de datos inicializado correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar el esquema:', error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
      console.log('🔄 Conexión liberada al pool.');
    }
  }
}

/**
 * Verifica la conexión inicial a la base de datos y opcionalmente inicializa el esquema.
 * @param {boolean} initSchema Si se debe inicializar el esquema (default: true).
 */
async function initializeDatabase(initSchema = true) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Conexión inicial a la base de datos establecida.');
    
    if (initSchema && process.env.NODE_ENV !== 'production') {
      await initializeDatabaseSchema();
    }
  } catch (error) {
    console.error('❌ Error crítico al conectar a la base de datos:', error.message);
    handleConnectionError(error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Maneja errores específicos de conexión a la base de datos.
 * @param {Error} error Error capturado durante la conexión.
 */
function handleConnectionError(error) {
  const errorMessages = {
    PROTOCOL_CONNECTION_LOST: 'La conexión a la base de datos se cerró inesperadamente.',
    ER_CON_COUNT_ERROR: 'Demasiadas conexiones. Ajusta el límite en connectionLimit.',
    ECONNREFUSED: 'Conexión rechazada. Verifica host y puerto del servidor MySQL.',
    ER_ACCESS_DENIED_ERROR: 'Acceso denegado. Verifica usuario y contraseña.',
  };

  const message = errorMessages[error.code] || 'Error desconocido al conectar a la base de datos.';
  console.error(`❌ ${message}`, error.message);
}

// Inicializa la conexión al cargar el módulo (solo en desarrollo o si es necesario)
initializeDatabase(process.env.NODE_ENV !== 'production');

module.exports = {
  pool,
  getConnection,
  initializeDatabaseSchema,
};