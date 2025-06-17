const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');

router.post('/estudios', estudioController.crear);
router.get('/estudios', estudioController.listar);
router.get('/estudios/:id', estudioController.obtenerPorId);
router.put('/estudios/:id', estudioController.actualizar);
router.delete('/estudios/:id', estudioController.eliminar);

module.exports = router;
