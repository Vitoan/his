module.exports = (sequelize, DataTypes) => {
  const Admision = sequelize.define('Admision', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    turnoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  return Admision;
};
