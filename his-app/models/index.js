const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('his_db', 'root', '2412Vavo', {
  host: 'localhost',
  dialect: 'mysql'
});

// Modelos
const Usuario = require('./usuario')(sequelize, DataTypes);
const Paciente = require('./Paciente')(sequelize, DataTypes);
const Medico = require('./medico')(sequelize, DataTypes);
const Turno = require('./turno')(sequelize, DataTypes);

// Relaciones
Paciente.hasMany(Turno, { foreignKey: 'pacienteId' });
Turno.belongsTo(Paciente, { foreignKey: 'pacienteId' });

Medico.hasMany(Turno, { foreignKey: 'medicoId' });
Turno.belongsTo(Medico, { foreignKey: 'medicoId' });

module.exports = {
  sequelize,
  Usuario,
  Paciente,
  Medico,
  Turno
};

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Tablas sincronizadas');
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar tablas:', error);
  });
