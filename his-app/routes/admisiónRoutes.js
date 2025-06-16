const express = require('express');
const router = express.Router();
const controller = require('../controllers/admisionController');

router.post('/', controller.crearAdmision);
router.get('/vista', controller.vistaListarAdmisiones);
router.get('/vista/:id', controller.vistaDetalle);
router.get('/', controller.listarAdmisiones);
router.get('/:id', controller.obtenerAdmision);
router.put('/:id', controller.actualizarAdmision);
router.delete('/:id', controller.eliminarAdmision);
router.get('/vista/:id/editar', controller.vistaEditar);
router.post('/vista/:id/editar', controller.procesarEdicion);



module.exports = router;
