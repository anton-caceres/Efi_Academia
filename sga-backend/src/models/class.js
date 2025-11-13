module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define(
    'Class',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      id_asignatura: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      id_profesor: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      horario: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salon: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'classes',
      underscored: true
    }
  );

  return Class;
};
