const bcrypt = require('bcryptjs');
const { User } = require('../models');
const {
  generateAuthToken,
  generatePasswordResetToken,
  verifyToken
} = require('../utils/jwtUtils');

// POST /auth/register
async function register(req, res) {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    if (!nombre || !correo || !contraseña || !rol) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const rolesPermitidos = ['admin', 'profesor', 'estudiante'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const existing = await User.findOne({ where: { correo } });
    if (existing) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const user = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol
    });

    const token = generateAuthToken(user);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      },
      token
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateAuthToken(user);

    return res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// GET /auth/me
async function me(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'correo', 'rol', 'is_active']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error en me:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// POST /auth/request-password-reset
async function requestPasswordReset(req, res) {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ message: 'El correo es obligatorio' });
    }

    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.json({
        message:
          'Si existe un usuario con ese correo, se ha enviado un enlace para restablecer la contraseña'
      });
    }

    const resetToken = generatePasswordResetToken(user);
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    console.log('🔗 Enlace para restablecer contraseña (simulado):', resetLink);

    return res.json({
      message:
        'Se ha generado un enlace para restablecer la contraseña (simulado, revisá la consola del servidor)'
    });
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// POST /auth/reset-password
async function resetPassword(req, res) {
  try {
    const { token, nuevaContraseña } = req.body;

    if (!token || !nuevaContraseña) {
      return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios' });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      console.error('Error verificando token de reset:', error.message);
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ message: 'Token inválido para restablecer contraseña' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashed = await bcrypt.hash(nuevaContraseña, 10);
    user.contraseña = hashed;
    await user.save();

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = {
  register,
  login,
  me,
  requestPasswordReset,
  resetPassword
};
