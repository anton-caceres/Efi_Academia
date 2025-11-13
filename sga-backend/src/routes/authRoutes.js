const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {
  register,
  login,
  me,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');

// Registro
router.post('/register', register);

// Login
router.post('/login', login);

// Perfil del usuario autenticado
router.get('/me', authMiddleware, me);

// Recuperación de contraseña
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
