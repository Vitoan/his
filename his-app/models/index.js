const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('his_db', 'root', '2412Vavo', {
  host: 'localhost',
  dialect: 'mysql'
});

// Modelos
const Usuario = require('./usuario')(sequelize, DataTypes);
const Paciente = require('./Paciente')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Usuario,
  Paciente
};

sequelize.sync({ alter: true }) // también podés usar { force: true } si querés borrar y crear todo de cero
  .then(() => {
    console.log('✅ Tablas sincronizadas');
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar tablas:', error);
  });