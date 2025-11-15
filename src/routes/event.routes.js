const express = require('express');
const router = express.Router();
const controller = require('../controllers/event.controller');

router.post('/', controller.create);      // Crear evento
router.get('/', controller.index);        // Listar eventos
router.get('/:id', controller.show);      // Obtener evento por ID
router.put('/:id', controller.update);    // Actualizar evento
router.delete('/:id', controller.remove); // Eliminar evento
router.get('/:id/stats', controller.stats);


module.exports = router;
