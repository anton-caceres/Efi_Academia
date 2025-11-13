const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = '8h';

function generateAuthToken(user) {
  const payload = {
    id: user.id,
    rol: user.rol,
    correo: user.correo
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function generatePasswordResetToken(user) {
  const payload = {
    id: user.id,
    type: 'password_reset'
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateAuthToken,
  generatePasswordResetToken,
  verifyToken
};
