module.exports = (sequelize, DataTypes) => {
  const Receta = sequelize.define('Receta', {
    consultaMedicaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    medicamento: { // <- Singular
      type: DataTypes.STRING,
      allowNull: false
    },
    indicaciones: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Receta;
};