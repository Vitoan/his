const express = require('express');
const router = express.Router();
const { Admision, Paciente, Turno } = require('../models');

// LISTAR TODAS LAS ADMISIONES
router.get('/', async (req, res) => {
  try {
    const admisiones = await Admision.findAll({
      include: [Paciente, Turno],
    });
    res.render('admision/index', { admisiones });
  } catch (error) {
    res.status(500).send('Error al cargar admisiones');
  }
});

// FORMULARIO DE NUEVA ADMISION
router.get('/nueva', (req, res) => {
  res.render('admision/nueva');
});

// CREAR ADMISION (usa post)
router.post('/', async (req, res) => {
  try {
    await Admision.create(req.body);
    res.redirect('/admision');
  } catch (error) {
    res.status(500).send('Error al crear admisión');
  }
});

// DETALLE DE UNA ADMISION
router.get('/:id', async (req, res) => {
  try {
    const admision = await Admision.findByPk(req.params.id, {
      include: [Paciente, Turno],
    });
    if (!admision) return res.status(404).send('No encontrada');
    res.render('admision/detalle', { admision });
  } catch (error) {
    res.status(500).send('Error al cargar detalle');
  }
});

// FORMULARIO DE EDICIÓN
router.get('/:id/editar', async (req, res) => {
  try {
    const admision = await Admision.findByPk(req.params.id);
    if (!admision) return res.status(404).send('No encontrada');
    res.render('admision/editar', { admision });
  } catch (error) {
    res.status(500).send('Error al cargar edición');
  }
});

// ACTUALIZAR ADMISION (usa PUT via override)
router.put('/:id', async (req, res) => {
  try {
    const admision = await Admision.findByPk(req.params.id);
    await admision.update(req.body);
    res.redirect('/admision');
  } catch (error) {
    res.status(500).send('Error al actualizar');
  }
});

module.exports = router;