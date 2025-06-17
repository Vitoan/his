// controllers/pacienteController.js
const db = require('../config/db'); // Importa la conexión a la base de datos

/**
 * Muestra el formulario de admisión de pacientes.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
exports.mostrarFormularioAdmision = (req, res) => {
    res.render('formularioAdmision', { title: 'Admisión de Pacientes' });
};

/**
 * Procesa el registro o actualización de un paciente y su internación,
 * incluyendo la lógica de asignación de cama.
 * Utiliza transacciones para asegurar la integridad de los datos.
 * @param {Object} req - Objeto de solicitud de Express (contiene datos del formulario).
 * @param {Object} res - Objeto de respuesta de Express.
 */
exports.procesarAdmision = async (req, res) => {
    const {
        dni, nombre, apellido, fecha_nacimiento, sexo,
        direccion, telefono, email, grupo_sanguineo,
        alergias, antecedentes_medicos, motivo_internacion
    } = req.body;

    let connection; // Variable para la conexión de la transacción
    try {
        connection = await db.getConnection(); // Obtiene una conexión del pool
        await connection.beginTransaction(); // Inicia la transacción

        // 1. Registrar o actualizar paciente
        const [pacienteExistente] = await connection.execute(
            'SELECT id_paciente FROM pacientes WHERE dni = ?',
            [dni]
        );

        let idPaciente;
        if (pacienteExistente.length > 0) {
            idPaciente = pacienteExistente[0].id_paciente;
            await connection.execute(
                `UPDATE pacientes SET nombre = ?, apellido = ?, fecha_nacimiento = ?, sexo = ?,
                 direccion = ?, telefono = ?, email = ?, grupo_sanguineo = ?,
                 alergias = ?, antecedentes_medicos = ?, motivo_internacion = ?
                 WHERE id_paciente = ?`,
                [
                    nombre, apellido, fecha_nacimiento, sexo,
                    direccion, telefono, email, grupo_sanguineo,
                    alergias, antecedentes_medicos, motivo_internacion,
                    idPaciente
                ]
            );
        } else {
            const [resultado] = await connection.execute(
                `INSERT INTO pacientes (dni, nombre, apellido, fecha_nacimiento, sexo,
                 direccion, telefono, email, grupo_sanguineo,
                 alergias, antecedentes_medicos, motivo_internacion)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    dni, nombre, apellido, fecha_nacimiento, sexo,
                    direccion, telefono, email, grupo_sanguineo,
                    alergias, antecedentes_medicos, motivo_internacion
                ]
            );
            idPaciente = resultado.insertId;
        }

        // 2. Lógica para asignar una cama
        const [camasDisponibles] = await connection.execute(`
            SELECT c.id_cama, c.numero_cama, h.id_habitacion, h.numero_habitacion, h.tipo_habitacion, p_ocupante.sexo AS sexo_ocupante
            FROM camas c
            JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
            LEFT JOIN pacientes p_ocupante ON c.id_paciente_ocupante = p_ocupante.id_paciente
            WHERE c.estado = 'libre' AND c.higienizada = TRUE
        `);

        let camaSeleccionada = null;
        for (const cama of camasDisponibles) {
            if (cama.tipo_habitacion === 'individual') {
                camaSeleccionada = cama;
                break;
            } else if (cama.tipo_habitacion === 'doble') {
                const [otraCamaEnHabitacion] = await connection.execute(`
                    SELECT c2.id_cama, c2.id_paciente_ocupante, p2.sexo
                    FROM camas c2
                    LEFT JOIN pacientes p2 ON c2.id_paciente_ocupante = p2.id_paciente
                    WHERE c2.id_habitacion = ? AND c2.id_cama != ? AND c2.estado = 'ocupada'
                `, [cama.id_habitacion, cama.id_cama]);

                if (otraCamaEnHabitacion.length > 0) {
                    const sexoOtroPaciente = otraCamaEnHabitacion[0].sexo;
                    if (sexoOtroPaciente && sexoOtroPaciente !== sexo) {
                        continue; // No se puede asignar esta cama, busca la siguiente
                    }
                }
                camaSeleccionada = cama; // Esta cama doble es válida
                break;
            }
        }

        if (!camaSeleccionada) {
            throw new Error('No hay camas disponibles que cumplan los requisitos de admisión en este momento.');
        }

        // 3. Actualizar el estado de la cama a 'ocupada' y asignarle el paciente
        await connection.execute(
            'UPDATE camas SET estado = ?, id_paciente_ocupante = ? WHERE id_cama = ?',
            ['ocupada', idPaciente, camaSeleccionada.id_cama]
        );

        // 4. Registrar la internación del paciente
        await connection.execute(
            'INSERT INTO pacientes_internados (id_paciente, id_cama, fecha_ingreso, estado) VALUES (?, ?, NOW(), ?)',
            [idPaciente, camaSeleccionada.id_cama, 'internado']
        );

        await connection.commit(); // Confirma la transacción si todas las operaciones fueron exitosas
        res.redirect(`/admision/exito?nombrePaciente=${encodeURIComponent(`${nombre} ${apellido}`)}&infoCama=${encodeURIComponent(`Habitación ${camaSeleccionada.numero_habitacion}, Cama ${camaSeleccionada.numero_cama}`)}`);

    } catch (error) {
        if (connection) {
            await connection.rollback(); // Deshace la transacción en caso de error
        }
        console.error('❌ Error durante el proceso de admisión:', error);
        res.status(500).render('error', { title: 'Error de Admisión', message: `No se pudo completar la admisión. ${error.message}` });
    } finally {
        if (connection) {
            connection.release(); // Libera la conexión de vuelta al pool
        }
    }
};

/**
 * Muestra una lista de todos los pacientes registrados.
 * (Opcional: útil para verificar registros)
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
exports.listarPacientes = async (req, res) => {
    try {
        const [filas] = await db.execute('SELECT id_paciente, dni, nombre, apellido, sexo, fecha_registro FROM pacientes ORDER BY fecha_registro DESC');
        res.render('listaPacientes', { title: 'Lista de Pacientes', pacientes: filas });
    }
    catch (error) {
        console.error('❌ Error al obtener la lista de pacientes:', error);
        res.status(500).render('error', { title: 'Error', message: 'No se pudo cargar la lista de pacientes.' });
    }
};
