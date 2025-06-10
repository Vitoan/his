module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ConsultaMedica', {
    fechaHora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    diagnostico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tratamiento: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
