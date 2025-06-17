// models/especialidad.js
module.exports = (sequelize, DataTypes) => {
  const Especialidad = sequelize.define('Especialidad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'especialidades',
    timestamps: false
  });

  return Especialidad;
};
