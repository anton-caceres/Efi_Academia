const { Subject } = require('../models');

// GET /subjects
async function getAllSubjects(req, res) {
  try {
    const subjects = await Subject.findAll();
    return res.json(subjects);
  } catch (error) {
    console.error('Error en getAllSubjects:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// GET /subjects/:id
async function getSubjectById(req, res) {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({ message: 'Asignatura no encontrada' });
    }

    return res.json(subject);
  } catch (error) {
    console.error('Error en getSubjectById:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// POST /subjects (solo admin)
async function createSubject(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const subject = await Subject.create({ nombre, descripcion: descripcion || null });

    return res.status(201).json(subject);
  } catch (error) {
    console.error('Error en createSubject:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// PUT /subjects/:id (solo admin)
async function updateSubject(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: 'Asignatura no encontrada' });
    }

    subject.nombre = nombre ?? subject.nombre;
    subject.descripcion = descripcion ?? subject.descripcion;

    await subject.save();

    return res.json(subject);
  } catch (error) {
    console.error('Error en updateSubject:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

// DELETE /subjects/:id (solo admin)
async function deleteSubject(req, res) {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: 'Asignatura no encontrada' });
    }

    await subject.destroy();

    return res.json({ message: 'Asignatura eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteSubject:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
