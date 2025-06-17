module.exports = (sequelize, DataTypes) => {
  const Paciente = sequelize.define('Paciente', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true }
    },
    telefono: {
      type: DataTypes.STRING
    },
    direccion: {
      type: DataTypes.STRING
    }
  });

  return Paciente;
};
