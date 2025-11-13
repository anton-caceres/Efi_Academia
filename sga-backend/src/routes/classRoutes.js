const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/classController');

// Todas requieren estar logueado
router.use(authMiddleware);

// Listar clases
router.get('/', getAllClasses);

// Obtener clase por id
router.get('/:id', getClassById);

// Crear clase: admin o profesor
router.post('/', checkRole('admin', 'profesor'), createClass);

// Actualizar clase: admin o profesor dueño
router.put('/:id', checkRole('admin', 'profesor'), updateClass);

// Eliminar clase: admin o profesor dueño
router.delete('/:id', checkRole('admin', 'profesor'), deleteClass);

module.exports = router;
