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
const Especialidad = require('./especialidad')(sequelize, DataTypes);
const ConsultaMedica = require('./consultaMedica')(sequelize, DataTypes);
const Receta = require('./receta')(sequelize, DataTypes);
const Diagnostico = require('./diagnostico')(sequelize, DataTypes);
const EstudioMedico = require('./estudioMedico')(sequelize, DataTypes);
const ResultadoEstudio = require('./ResultadoEstudio')(sequelize, DataTypes);
const Admision = require('./admision')(sequelize, DataTypes);

// Relaciones
Paciente.hasMany(Turno, { foreignKey: 'pacienteId' });
Turno.belongsTo(Paciente, { foreignKey: 'pacienteId' });

Medico.hasMany(Turno, { foreignKey: 'medicoId' });
Turno.belongsTo(Medico, { foreignKey: 'medicoId' });

// Asociación: Medico pertenece a una Especialidad
Medico.belongsTo(Especialidad, {
  foreignKey: 'especialidadId',
  as: 'medicoEspecialidad' // Changed 'as' here
});
Especialidad.hasMany(Medico, {
  foreignKey: 'especialidadId',
  as: 'medicos'
});

Turno.hasOne(ConsultaMedica, { foreignKey: 'turnoId' });
ConsultaMedica.belongsTo(Turno, { foreignKey: 'turnoId' });

ConsultaMedica.hasMany(Receta, { foreignKey: 'consultaMedicaId' });
Receta.belongsTo(ConsultaMedica, { foreignKey: 'consultaMedicaId' });

ConsultaMedica.hasOne(Diagnostico, { foreignKey: 'consultaMedicaId' });
Diagnostico.belongsTo(ConsultaMedica, { foreignKey: 'consultaMedicaId' });

// Asociación: ConsultaMedica tiene muchos EstudiosMedicos
ConsultaMedica.hasMany(EstudioMedico, { foreignKey: 'consultaMedicaId' });
EstudioMedico.belongsTo(ConsultaMedica, { foreignKey: 'consultaMedicaId' });

// Asociación: EstudioMedico tiene un ResultadoEstudio
EstudioMedico.hasOne(ResultadoEstudio, { foreignKey: 'estudioMedicoId' });
ResultadoEstudio.belongsTo(EstudioMedico, { foreignKey: 'estudioMedicoId' });

// Asociación: Paciente tiene muchas Admisiones
Paciente.hasMany(Admision, { foreignKey: 'pacienteId' });
Admision.belongsTo(Paciente, { foreignKey: 'pacienteId' });
// Asociación: Turno tiene muchas Admisiones
Turno.hasOne(Admision, { foreignKey: 'turnoId' });
Admision.belongsTo(Turno, { foreignKey: 'turnoId' });

module.exports = {
  sequelize,
  Usuario,
  Paciente,
  Medico,
  Turno,
  Especialidad,
  ConsultaMedica,
  Receta,
  Diagnostico,
  EstudioMedico,
  ResultadoEstudio,
  Admision
};

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Tablas sincronizadas');
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar tablas:', error);
  });
