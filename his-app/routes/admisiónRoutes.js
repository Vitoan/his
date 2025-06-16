const express = require('express');
const router = express.Router();
const controller = require('../controllers/admisionController');

router.post('/', controller.crearAdmision);
router.get('/vista', controller.vistaListarAdmisiones);
router.get('/vista/:id', controller.vistaDetalle);
router.get('/', controller.listarAdmisiones);
router.get('/editar/:id', async (req, res) => {
  try {
    const { Admision, Paciente, Turno } = require('../models');
    const admision = await Admision.findByPk(req.params.id, {
      include: [Paciente, Turno],
    });

    if (!admision) {
      return res.status(404).send('Admisión no encontrada');
    }

    res.render('admision/editar', { admision });
  } catch (error) {
    console.error('Error al mostrar el formulario de edición:', error);
    res.status(500).send('Error al cargar la admisión para editar');
  }
});
router.get('/:id', controller.obtenerAdmision);
router.put('/:id', controller.actualizarAdmision);
router.delete('/:id', controller.eliminarAdmision);
router.get('/vista/:id/editar', controller.vistaEditar);



module.exports = router;
