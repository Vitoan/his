module.exports = (sequelize, DataTypes) => {
  const ResultadoEstudio = sequelize.define('ResultadoEstudio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estudioMedicoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    archivoSimulado: {
      type: DataTypes.STRING, // Solo nombre de archivo simulado
      allowNull: true
    }
  });

  return ResultadoEstudio;
};
