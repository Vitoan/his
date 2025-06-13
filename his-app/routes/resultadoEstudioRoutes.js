const express = require('express');
const router = express.Router();
const controller = require('../controllers/resultadoEstudioController');

router.post('/', controller.crear);
router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
