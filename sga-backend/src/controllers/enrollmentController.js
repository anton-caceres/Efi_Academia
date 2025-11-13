const { Enrollment, Class, Subject, User } = require('../models');

// GET /enrollments
// Admin: todas, Profesor: inscripciones a sus clases, Estudiante: sus inscripciones
async function getAllEnrollments(req, res) {
  try {
    const where = {};
    const include = [
      {
        model: Class,
        as: 'clase',
        include: [
          { model: Subject, as: 'asignatura' },
          { model: User, as: 'profesor', attributes: ['id', 'nombre', 'correo'] }
        ]
      },
      { model: User, as: 'estudiante', attributes: ['id', 'nombre', 'correo'] }
    ];

    if (req.user.rol === 'estudiante') {
      where.id_usuario = req.user.id;
    }

    if (req.user.rol === 'profesor') {
      include[0].where = { id_profesor: req.user.id };
    }

    const enrollments = await Enrollment.findAll({
      where,
      include
    });

    return res.json(enrollments);
  } catch (error) {
    console.error('Error en getAllEnrollments:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// POST /enrollments (solo estudiante)
async function createEnrollment(req, res) {
  try {
    const { id_clase } = req.body;

    if (!id_clase) {
      return res.status(400).json({ message: 'id_clase es obligatorio' });
    }

    // Verificar que la clase exista
    const clase = await Class.findByPk(id_clase);
    if (!clase) {
      return res.status(404).json({ message: 'Clase no encontrada' });
    }

    // Verificar si ya está inscripto
    const existing = await Enrollment.findOne({
      where: {
        id_usuario: req.user.id,
        id_clase
      }
    });

    if (existing) {
      return res.status(409).json({ message: 'Ya estás inscripto en esta clase' });
    }

    const enrollment = await Enrollment.create({
      id_usuario: req.user.id,
      id_clase,
      fecha_inscripcion: new Date()
    });

    return res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error en createEnrollment:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// DELETE /enrollments/:id
// Estudiante: solo sus inscripciones
// Admin: cualquiera
async function deleteEnrollment(req, res) {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    if (req.user.rol === 'estudiante' && enrollment.id_usuario !== req.user.id) {
      return res.status(403).json({ message: 'No podés cancelar esta inscripción' });
    }

    await enrollment.destroy();

    return res.json({ message: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteEnrollment:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment
};
