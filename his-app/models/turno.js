module.exports = (sequelize, DataTypes) => {
  const Turno = sequelize.define('Turno', {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'pendiente'
    }
  });

  return Turno;
};
