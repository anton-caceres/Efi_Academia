const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// User
const User = require('./user')(sequelize, DataTypes);
// Subject
const Subject = require('./subject')(sequelize, DataTypes);
// Class
const Class = require('./class')(sequelize, DataTypes);
// Enrollment
const Enrollment = require('./enrollment')(sequelize, DataTypes);

// Relaciones
// User (profesor) tiene muchas Class
User.hasMany(Class, { foreignKey: 'id_profesor', as: 'clasesImpartidas' });
Class.belongsTo(User, { foreignKey: 'id_profesor', as: 'profesor' });

// Subject tiene muchas Class
Subject.hasMany(Class, { foreignKey: 'id_asignatura', as: 'clases' });
Class.belongsTo(Subject, { foreignKey: 'id_asignatura', as: 'asignatura' });

// User (estudiante) tiene muchas Enrollment
User.hasMany(Enrollment, { foreignKey: 'id_usuario', as: 'inscripciones' });
Enrollment.belongsTo(User, { foreignKey: 'id_usuario', as: 'estudiante' });

// Class tiene muchas Enrollment
Class.hasMany(Enrollment, { foreignKey: 'id_clase', as: 'inscripciones' });
Enrollment.belongsTo(Class, { foreignKey: 'id_clase', as: 'clase' });

module.exports = {
  sequelize,
  User,
  Subject,
  Class,
  Enrollment
};
