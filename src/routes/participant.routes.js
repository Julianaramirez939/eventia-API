const express = require('express');
const router = express.Router();
const controller = require('../controllers/participant.controller');

router.post('/', controller.create);         // Crear participante
router.get('/', controller.index);           // Listar
router.get('/:id', controller.show);         // Obtener por ID
router.put('/:id', controller.update);       // Actualizar
router.delete('/:id', controller.remove);    // Eliminar

module.exports = router;
