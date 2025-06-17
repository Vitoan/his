const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ruta para mostrar el formulario de admisión de pacientes
// GET / (cuando se monta en /admision, esto es /admision/)
router.get('/', pacienteController.mostrarFormularioAdmision);

// Ruta para procesar el registro y la admisión del paciente
// POST / (cuando se monta en /admision, esto es POST /admision/)
router.post('/', pacienteController.procesarAdmision);

// Ruta para mostrar la página de éxito después de la admisión
// GET /exito (cuando se monta en /admision, esto es /admision/exito)
router.get('/exito', (req, res) => {
    res.render('admisionExitosa', {
        title: 'Admisión Exitosa',
        nombrePaciente: req.query.nombrePaciente || 'Paciente',
        infoCama: req.query.infoCama || 'Cama asignada'
    });
});

// Ruta opcional para ver la lista de todos los pacientes
// (Esta ruta dentro de este router.get('/lista') será menos relevante ahora
// porque app.js tiene una ruta explícita para '/pacientes/lista',
// pero la mantenemos aquí por si este router se usara de otra forma en el futuro).
router.get('/lista', pacienteController.listarPacientes);

module.exports = router;
