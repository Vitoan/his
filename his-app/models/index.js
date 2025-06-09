const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('his_db', 'root', '2412Vavo', {
  host: 'localhost',
  dialect: 'mysql'
});

const Usuario = require('./usuario')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Usuario
};