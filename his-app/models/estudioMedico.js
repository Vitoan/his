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
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en proceso', 'completado'),
      defaultValue: 'pendiente',
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('laboratorio', 'imagen', 'otros'),
      allowNull: false
    },
    archivo: {
      type: DataTypes.STRING, // Simulación
      allowNull: true
    }
  }, {
    tableName: 'estudios_medicos'
  });
};
