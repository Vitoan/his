// Este archivo contiene la lógica para interactuar con las tablas 'pacientes' y 'camas' en la base de datos,
// incluyendo la lógica de las transacciones y la asignación de camas.

const { pool, getConnection } = require('../config/db');

/**
 * Busca un paciente en la base de datos por su número de DNI.
 * @param {string} dni - El DNI del paciente a buscar.
 * @param {Object} [connection] - Opcional: La conexión de base de datos a usar (para transacciones).
 * Por defecto, usará el pool si no se proporciona.
 * @returns {Object|undefined} El objeto paciente si se encuentra, de lo contrario, undefined.
 */
async function buscarPacientePorDNI(dni, connection = pool) {
  // Utiliza la conexión proporcionada o el pool por defecto.
  const [rows] = await connection.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);
  return rows[0]; // Devuelve el primer paciente encontrado o undefined
}

/**
 * Inserta un nuevo paciente en la tabla 'pacientes'.
 * @param {Object} pacienteData - Objeto con los datos del nuevo paciente.
 * @param {Object} connection - La conexión de base de datos a usar (para transacciones).
 * @returns {number} El ID del paciente recién insertado.
 */
async function insertarPaciente(pacienteData, connection) {
  const { dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email, grupo_sanguineo, alergias, antecedentes_medicos, motivo_internacion } = pacienteData;
  const fecha_registro = new Date(); // Fecha actual de registro
  const [result] = await connection.execute(
    'INSERT INTO pacientes (dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email, grupo_sanguineo, alergias, antecedentes_medicos, motivo_internacion, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email, grupo_sanguineo, alergias, antecedentes_medicos, motivo_internacion, fecha_registro]
  );
  return result.insertId; // Devuelve el ID del nuevo paciente insertado
}

/**
 * Actualiza los datos de un paciente existente en la tabla 'pacientes'.
 * @param {number} id_paciente - El ID del paciente a actualizar.
 * @param {Object} pacienteData - Objeto con los datos actualizados del paciente.
 * @param {Object} connection - La conexión de base de datos a usar (para transacciones).
 * @returns {boolean} True si se actualizó al menos una fila, false de lo contrario.
 */
async function actualizarPaciente(id_paciente, pacienteData, connection) {
  const { dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email, grupo_sanguineo, alergias, antecedentes_medicos, motivo_internacion } = pacienteData;
  const [result] = await connection.execute(
    'UPDATE pacientes SET dni = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, sexo = ?, direccion = ?, telefono = ?, email = ?, grupo_sanguineo = ?, alergias = ?, antecedentes_medicos = ?, motivo_internacion = ? WHERE id_paciente = ?',
    [dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email, grupo_sanguineo, alergias, antecedentes_medicos, motivo_internacion, id_paciente]
  );
  return result.affectedRows > 0; // Devuelve true si se actualizó al menos una fila
}

/**
 * Busca una cama disponible según las reglas de admisión (individual, doble con mismo sexo).
 * @param {string} sexoPaciente - El sexo del paciente que necesita la cama ('M', 'F', 'Otro').
 * @param {Object} connection - La conexión de base de datos a usar (para transacciones).
 * @returns {Object|null} El objeto de la cama seleccionada si se encuentra, de lo contrario, null.
 */
async function buscarCamaDisponible(sexoPaciente, connection) {
  // 1. Primero, buscar una cama individual (tipo_habitacion = 'individual') libre y higienizada
  let [camas] = await connection.execute(
    `SELECT c.id_cama, c.numero_cama, h.numero_habitacion, h.tipo_habitacion, a.nombre_ala
     FROM camas c
     JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
     JOIN alas a ON h.id_ala = a.id_ala
     WHERE c.estado = 'libre' AND c.higienizada = TRUE AND h.tipo_habitacion = 'individual'
     LIMIT 1`
  );

  if (camas.length > 0) {
    return camas[0];
  }

  // 2. Si no hay individuales, buscar una cama doble (tipo_habitacion = 'doble') libre y higienizada
  //    que no tenga un paciente de sexo opuesto en la otra cama.
  [camas] = await connection.execute(
    `SELECT c1.id_cama, c1.numero_cama, h.numero_habitacion, h.tipo_habitacion, a.nombre_ala
     FROM camas c1
     JOIN habitaciones h ON c1.id_habitacion = h.id_habitacion
     JOIN alas a ON h.id_ala = a.id_ala
     WHERE c1.estado = 'libre' AND c1.higienizada = TRUE AND h.tipo_habitacion = 'doble'
       AND NOT EXISTS (
         SELECT 1 FROM camas c2
         JOIN pacientes p ON c2.id_paciente_ocupante = p.id_paciente
         WHERE c2.id_habitacion = c1.id_habitacion
           AND c2.id_cama != c1.id_cama
           AND p.sexo != ? -- El otro paciente es de sexo opuesto
       )
     LIMIT 1`,
    [sexoPaciente]
  );

  if (camas.length > 0) {
    return camas[0];
  }

  return null; // No se encontró cama disponible
}

/**
 * Asigna una cama a un paciente actualizando el estado de la cama.
 * @param {number} id_cama - El ID de la cama a asignar.
 * @param {number} id_paciente - El ID del paciente que ocupará la cama.
 * @param {Object} connection - La conexión de base de datos a usar (para transacciones).
 * @returns {boolean} True si la cama fue asignada, false de lo contrario.
 */
async function asignarCama(id_cama, id_paciente, connection) {
  console.log(`[asignarCama] Intentando asignar cama ${id_cama} al paciente ${id_paciente}`); // Debug log
  const [result] = await connection.execute(
    'UPDATE camas SET estado = ?, id_paciente_ocupante = ? WHERE id_cama = ?',
    ['ocupada', id_paciente, id_cama]
  );
  console.log(`[asignarCama] Resultado de UPDATE camas: ${JSON.stringify(result)}`); // Debug log
  return result.affectedRows > 0;
}

/**
 * Registra la internación de un paciente en la tabla 'pacientes_internados'.
 * @param {number} id_paciente - El ID del paciente internado.
 * @param {number} id_cama - El ID de la cama asignada para la internación.
 * @param {Object} connection - La conexión de base de datos a usar (para transacciones).
 * @returns {number} El ID de la internación recién insertada.
 */
async function registrarInternacion(id_paciente, id_cama, connection) {
  const [result] = await connection.execute(
    'INSERT INTO pacientes_internados (id_paciente, id_cama, fecha_ingreso, estado) VALUES (?, ?, NOW(), ?)',
    [id_paciente, id_cama, 'internado']
  );
  return result.insertId;
}


/**
 * Función principal para admitir un paciente, gestionando la lógica completa
 * de registro/actualización y asignación de cama, todo dentro de una transacción.
 * @param {Object} pacienteData - Los datos completos del paciente para la admisión.
 * @returns {Object} Un objeto con el resultado de la operación (éxito, ID del paciente, cama asignada).
 * @throws {Error} Si no se puede completar la admisión (ej. no hay camas disponibles).
 */
async function admitirPaciente(pacienteData) {
  let connection;
  try {
    connection = await getConnection(); // Obtener una conexión del pool para la transacción
    await connection.beginTransaction(); // Iniciar la transacción

    let id_paciente;
    // Pasa la conexión de la transacción a buscarPacientePorDNI para ver cambios no confirmados
    const pacienteExistente = await buscarPacientePorDNI(pacienteData.dni, connection);

    if (pacienteExistente) {
      // Si el paciente existe, actualizar sus datos
      await actualizarPaciente(pacienteExistente.id_paciente, pacienteData, connection);
      id_paciente = pacienteExistente.id_paciente;
      console.log(`[admitirPaciente] Paciente con DNI ${pacienteData.dni} actualizado. ID: ${id_paciente}`);

      // --- NUEVA LÓGICA: Liberar cama anterior si el paciente ya ocupaba una ---
      // Buscar si este paciente ya estaba ocupando alguna cama
      const [previousBedRows] = await connection.execute(
        'SELECT id_cama FROM camas WHERE id_paciente_ocupante = ?',
        [id_paciente]
      );

      if (previousBedRows.length > 0) {
        const previousCamaId = previousBedRows[0].id_cama;
        console.log(`[admitirPaciente] Paciente ${id_paciente} previamente ocupaba cama ${previousCamaId}. Liberando...`);
        // Actualizar la cama anterior: estado a 'higienizacion_pendiente' y id_paciente_ocupante a NULL
        await connection.execute(
          'UPDATE camas SET estado = ?, id_paciente_ocupante = NULL WHERE id_cama = ?',
          ['higienizacion_pendiente', previousCamaId] // Se marca para limpieza al dar de alta
        );
        console.log(`[admitirPaciente] Cama ${previousCamaId} liberada y puesta en estado 'higienizacion_pendiente'.`);
      }
      // --- FIN NUEVA LÓGICA ---

    } else {
      // Si el paciente no existe, insertar uno nuevo
      id_paciente = await insertarPaciente(pacienteData, connection);
      console.log(`[admitirPaciente] Nuevo paciente insertado. ID: ${id_paciente}`);
    }

    // --- IMPORTANTE: VALIDACIÓN Y LOGS ---
    if (!id_paciente || typeof id_paciente !== 'number' || id_paciente <= 0) {
        throw new Error('Error interno: El ID de paciente obtenido es inválido. No se puede proceder con la asignación de cama.');
    }
    console.log(`[admitirPaciente] Verificando ID de paciente para asignación: ${id_paciente}`);
    // --- FIN VALIDACIÓN IMPORTANTE ---


    // Buscar una cama disponible
    const camaDisponible = await buscarCamaDisponible(pacienteData.sexo, connection);

    if (!camaDisponible) {
      throw new Error('No hay camas disponibles que cumplan los requisitos de admisión.');
    }
    console.log(`[admitirPaciente] Cama disponible encontrada: ${JSON.stringify(camaDisponible)}`);

    // Asignar la cama al paciente (actualizar estado de la cama)
    const camaAsignada = await asignarCama(camaDisponible.id_cama, id_paciente, connection);
    if (!camaAsignada) {
      throw new Error('No se pudo asignar la cama. Por favor, inténtelo de nuevo.');
    }

    // Registrar la internación del paciente (nueva entrada en pacientes_internados)
    await registrarInternacion(id_paciente, camaDisponible.id_cama, connection);
    console.log(`[admitirPaciente] Internación registrada para paciente ${id_paciente} en cama ${camaDisponible.id_cama}.`);


    await connection.commit(); // Confirmar la transacción
    console.log('[admitirPaciente] Transacción de admisión completada con éxito.');

    return {
      success: true,
      id_paciente: id_paciente,
      camaAsignada: camaDisponible,
      nombrePaciente: `${pacienteData.nombre} ${pacienteData.apellido}`
    };

  } catch (error) {
    if (connection) {
      await connection.rollback(); // Revertir la transacción en caso de error
      console.log('[admitirPaciente] Transacción de admisión revertida debido a un error.');
    }
    console.error('❌ Error en el proceso de admisión:', error);
    throw error; // Propagar el error para el controlador
  } finally {
    if (connection) {
      connection.release(); // Liberar la conexión al pool
      console.log('[admitirPaciente] Conexión a la BD liberada.');
    }
  }
}

/**
 * Obtiene la lista de todos los pacientes desde la base de datos.
 * @returns {Array<Object>} Un array de objetos paciente.
 */
async function listarTodosLosPacientes() {
  const [rows] = await pool.query('SELECT id_paciente, dni, nombre, apellido, sexo, fecha_registro FROM pacientes ORDER BY fecha_registro DESC');
  return rows;
}

/**
 * Obtiene un resumen de la disponibilidad de camas (total, disponibles, ocupadas).
 * @returns {Object} Un objeto con el resumen de camas.
 */
async function obtenerResumenCamas() {
  const [resumen] = await pool.query(`
    SELECT
        SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) AS camasOcupadas,
        SUM(CASE WHEN estado = 'libre' AND higienizada = TRUE THEN 1 ELSE 0 END) AS camasDisponibles,
        COUNT(*) AS totalCamas
    FROM camas;
  `);
  return resumen[0]; // La consulta SUM devuelve una sola fila
}

/**
 * Obtiene el detalle de todas las camas, incluyendo información del paciente ocupante si aplica.
 * @returns {Array<Object>} Un array de objetos con el detalle de cada cama.
 */
async function obtenerDetalleCamas() {
  const [rows] = await pool.query(`
    SELECT
      c.id_cama,
      c.numero_cama,
      c.estado,
      c.higienizada,
      h.numero_habitacion,
      h.tipo_habitacion,
      a.nombre_ala,
      p.nombre AS nombre_paciente,
      p.apellido AS apellido_paciente,
      p.sexo AS sexo_paciente
    FROM
      camas c
    JOIN
      habitaciones h ON c.id_habitacion = h.id_habitacion
    JOIN
      alas a ON h.id_ala = a.id_ala
    LEFT JOIN
      pacientes p ON c.id_paciente_ocupante = p.id_paciente
    ORDER BY
      a.nombre_ala, h.numero_habitacion, c.numero_cama;
  `);
  return rows;
}


module.exports = {
  admitirPaciente,
  listarTodosLosPacientes,
  obtenerResumenCamas,
  obtenerDetalleCamas
};
