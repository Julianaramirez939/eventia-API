const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendance.controller');

router.post('/', controller.create);          // Registrar asistencia
router.get('/', controller.index);            // Listar asistencias
router.get('/:id', controller.show);          // Obtener por ID
router.put('/:id', controller.update);        // Cambiar estado
router.delete('/:id', controller.remove);     // Eliminar

module.exports = router;
