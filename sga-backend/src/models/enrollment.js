module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    'Enrollment',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      id_clase: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      fecha_inscripcion: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      tableName: 'enrollments',
      underscored: true
    }
  );

  return Enrollment;
};
