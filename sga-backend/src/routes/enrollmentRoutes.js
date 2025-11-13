const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment
} = require('../controllers/enrollmentController');

// Todas requieren estar logueado
router.use(authMiddleware);

// Listar inscripciones
router.get('/', getAllEnrollments);

// Crear inscripción (solo estudiante)
router.post('/', checkRole('estudiante'), createEnrollment);

// Eliminar inscripción (admin o estudiante dueño)
router.delete('/:id', checkRole('admin', 'estudiante'), deleteEnrollment);

module.exports = router;
