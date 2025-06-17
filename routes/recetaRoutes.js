const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');

router.post('/', recetaController.crearReceta);
router.get('/', recetaController.obtenerRecetas);
router.get('/:id', recetaController.obtenerRecetaPorId);
router.put('/:id', recetaController.actualizarReceta);
router.delete('/:id', recetaController.eliminarReceta);

module.exports = router;
