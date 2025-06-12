module.exports = (sequelize, DataTypes) => {
  return sequelize.define('EstudioMedico', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    consultaMedicaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resultado: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};
