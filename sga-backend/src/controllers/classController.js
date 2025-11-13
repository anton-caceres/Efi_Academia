const { Class, Subject, User } = require('../models');

// GET /classes
// Admin: todas, Profesor: solo las suyas, Estudiante: todas (para ver oferta)
async function getAllClasses(req, res) {
  try {
    const where = {};

    if (req.user.rol === 'profesor') {
      where.id_profesor = req.user.id;
    }

    const classes = await Class.findAll({
      where,
      include: [
        { model: Subject, as: 'asignatura' },
        { model: User, as: 'profesor', attributes: ['id', 'nombre', 'correo'] }
      ]
    });

    return res.json(classes);
  } catch (error) {
    console.error('Error en getAllClasses:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// GET /classes/:id
async function getClassById(req, res) {
  try {
    const { id } = req.params;

    const clase = await Class.findByPk(id, {
      include: [
        { model: Subject, as: 'asignatura' },
        { model: User, as: 'profesor', attributes: ['id', 'nombre', 'correo'] }
      ]
    });

    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    return res.json(clase);
  } catch (error) {
    console.error('Error en getClassById:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// POST /classes (admin o profesor)
// Un admin puede crear clases para cualquier profesor.
// Un profesor solo puede crearlas para sí mismo.
async function createClass(req, res) {
  try {
    let { id_asignatura, id_profesor, horario, salon } = req.body;

    if (!id_asignatura || !horario || !salon) {
      return res.status(400).json({ message: 'id_asignatura, horario y salon son obligatorios' });
    }

    if (req.user.rol === 'profesor') {
      id_profesor = req.user.id;
    } else if (!id_profesor) {
      return res.status(400).json({ message: 'id_profesor es obligatorio para admin' });
    }

    const clase = await Class.create({
      id_asignatura,
      id_profesor,
      horario,
      salon
    });

    return res.status(201).json(clase);
  } catch (error) {
    console.error('Error en createClass:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// PUT /classes/:id (admin o profesor dueño de la clase)
async function updateClass(req, res) {
  try {
    const { id } = req.params;
    const { id_asignatura, horario, salon } = req.body;

    const clase = await Class.findByPk(id);

    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    // Si es profesor, solo puede modificar sus propias clases
    if (req.user.rol === 'profesor' && clase.id_profesor !== req.user.id) {
      return res.status(403).json({ message: 'No podés modificar esta clase' });
    }

    clase.id_asignatura = id_asignatura ?? clase.id_asignatura;
    clase.horario = horario ?? clase.horario;
    clase.salon = salon ?? clase.salon;

    await clase.save();

    return res.json(clase);
  } catch (error) {
    console.error('Error en updateClass:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// DELETE /classes/:id (admin o profesor dueño)
async function deleteClass(req, res) {
  try {
    const { id } = req.params;

    const clase = await Class.findByPk(id);

    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    if (req.user.rol === 'profesor' && clase.id_profesor !== req.user.id) {
      return res.status(403).json({ message: 'No podés eliminar esta clase' });
    }

    await clase.destroy();

    return res.json({ message: 'Clase eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteClass:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
