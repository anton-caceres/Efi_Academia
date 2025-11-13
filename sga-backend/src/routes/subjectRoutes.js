const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');

// Todas requieren estar logueado
router.use(authMiddleware);

// Listar todas las asignaturas (cualquier rol)
router.get('/', getAllSubjects);

// Obtener una asignatura por id (cualquier rol)
router.get('/:id', getSubjectById);

// Crear asignatura (solo admin)
router.post('/', checkRole('admin'), createSubject);

// Actualizar asignatura (solo admin)
router.put('/:id', checkRole('admin'), updateSubject);

// Eliminar asignatura (solo admin)
router.delete('/:id', checkRole('admin'), deleteSubject);

module.exports = router;
