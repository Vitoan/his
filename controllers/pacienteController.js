// controllers/pacienteController.js
// Este controlador maneja la lógica de las solicitudes HTTP, interactuando con el modelo de pacientes.

// Importa el módulo Paciente (Paciente.js) que contiene la lógica de negocio y acceso a la base de datos.
// CORRECCIÓN: Se asume que el archivo del modelo se llama 'Paciente.js' en la carpeta 'models/'.
const pacienteModel = require('../models/Paciente'); // Ruta corregida a 'Paciente'

/**
 * Muestra el formulario de admisión de pacientes.
 * Se accede vía GET a la ruta /admision.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
exports.mostrarFormularioAdmision = (req, res) => {
    // Renderiza la vista 'formularioAdmision.pug' y le pasa un título.
    res.render('formularioAdmision', { title: 'Admisión de Pacientes' });
};

/**
 * Procesa el registro o actualización de un paciente y su internación.
 * Esta función es la que maneja la lógica central de admisión, incluyendo la asignación de cama.
 * Se accede vía POST a la ruta /admision.
 * @param {Object} req - Objeto de solicitud de Express (contiene datos del formulario en req.body).
 * @param {Object} res - Objeto de respuesta de Express.
 */
exports.procesarAdmision = async (req, res) => {
    // Extrae los datos del formulario del cuerpo de la solicitud.
    const pacienteData = req.body;

    try {
        // Llama a la función 'admitirPaciente' del modelo para manejar toda la lógica de negocio,
        // incluyendo la transacción para registrar/actualizar el paciente y asignar la cama.
        const result = await pacienteModel.admitirPaciente(pacienteData);

        // Si la operación en el modelo fue exitosa, redirige a la página de éxito.
        if (result.success) {
            res.redirect(`/admision/exito?nombrePaciente=${encodeURIComponent(result.nombrePaciente)}&infoCama=${encodeURIComponent(`Habitación ${result.camaAsignada.numero_habitacion}, Cama ${result.camaAsignada.numero_cama}`)}`);
        } else {
            // En teoría, admitirPaciente lanza un error si no es exitoso,
            // pero este bloque es un fallback de seguridad.
            res.status(500).render('error', { title: 'Error en la Admisión', message: 'No se pudo completar la admisión por un motivo desconocido.' });
        }
    } catch (error) {
        // Captura cualquier error que ocurra durante el proceso de admisión (ej. no hay camas disponibles).
        console.error('❌ Error durante el proceso de admisión en el controlador:', error);
        // Renderiza una página de error, mostrando el mensaje de error al usuario.
        res.status(400).render('error', { title: 'Error de Admisión', message: error.message || 'Ocurrió un error al procesar la admisión.' });
    }
};

/**
 * Muestra una lista de todos los pacientes registrados.
 * Se accede vía GET a la ruta /pacientes/lista.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
exports.listarPacientes = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener todos los pacientes.
        const pacientes = await pacienteModel.listarTodosLosPacientes();
        // Renderiza la vista 'listaPacientes.pug' y le pasa la lista de pacientes.
        res.render('listaPacientes', { title: 'Lista de Pacientes', pacientes });
    } catch (error) {
        // Captura y registra errores si no se puede obtener la lista de pacientes.
        console.error('❌ Error al obtener la lista de pacientes:', error);
        // Renderiza una página de error para informar al usuario.
        res.status(500).render('error', { title: 'Error', message: 'No se pudo cargar la lista de pacientes.' });
    }
};

/**
 * Muestra la disponibilidad actual de camas.
 * Se accede vía GET a la ruta /camas/disponibilidad.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
exports.mostrarDisponibilidadCamas = async (req, res) => {
    try {
        // Llama a las funciones del modelo para obtener el resumen y el detalle de las camas.
        const resumen = await pacienteModel.obtenerResumenCamas();
        const detalleCamas = await pacienteModel.obtenerDetalleCamas();
        // Renderiza la vista 'disponibilidadCamas.pug' con los datos obtenidos.
        res.render('disponibilidadCamas', {
            title: 'Disponibilidad de Camas',
            resumen: resumen, // El modelo ya devuelve el objeto resumen directo
            detalleCamas: detalleCamas
        });
    } catch (error) {
        // Captura y registra errores si no se puede obtener la disponibilidad de camas.
        console.error('❌ Error al obtener la disponibilidad de camas:', error);
        // Renderiza una página de error para informar al usuario.
        res.status(500).render('error', { title: 'Error', message: 'No se pudo cargar la disponibilidad de camas.' });
    }
};
