const express = require('express');
const router = express.Router();
const controller = require('../controllers/admisionController');

router.post('/', controller.crearAdmision);
router.get('/', controller.listarAdmisiones);
router.get('/:id', controller.obtenerAdmision);
router.put('/:id', controller.actualizarAdmision);
router.delete('/:id', controller.eliminarAdmision);

module.exports = router;
