const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ruta para mostrar el formulario de admisión de pacientes
// GET /admision/
router.get('/', pacienteController.mostrarFormularioAdmision);

// Ruta para procesar el registro y la admisión del paciente
// POST /admision/
router.post('/', pacienteController.procesarAdmision);

// Ruta para mostrar la página de éxito después de la admisión
// GET /admision/exito
router.get('/exito', (req, res) => {
    // Los datos se pasan como query parameters para simplificar
    res.render('admisionExitosa', {
        title: 'Admisión Exitosa',
        nombrePaciente: req.query.nombrePaciente || 'Paciente',
        infoCama: req.query.infoCama || 'Cama asignada'
    });
});

// Ruta opcional para ver la lista de todos los pacientes
// GET /pacientes/lista (o /admision/lista, si prefieres)
router.get('/lista', pacienteController.listarPacientes);

module.exports = router;