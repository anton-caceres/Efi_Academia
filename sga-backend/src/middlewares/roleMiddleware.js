function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tenés permiso para acceder a este recurso' });
    }

    next();
  };
}

module.exports = checkRole;
