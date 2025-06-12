const express = require('express');
const app = express();
require('dotenv').config();
const sequelize = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base
app.get('/', (req, res) => {
  res.send('HIS - Sistema en marcha');
});

// Conexión a BD y servidor
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a la base de datos');
    return sequelize.sync({ alter: true }); // sincroniza modelos (luego podemos usar migraciones)
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la BD:', err);
  });
  
// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/usuarios', usuarioRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes); // o `/auth` si querés agrupar

const loginRoutes = require('./routes/loginRoutes');
app.use('/login', loginRoutes);

const pacienteRoutes = require('./routes/pacienteRoutes');
app.use('/pacientes', pacienteRoutes);

sequelize.sync(); 

const medicoRoutes = require('./routes/medicoRoutes');
app.use('/medicos', medicoRoutes);

const turnoRoutes = require('./routes/turnoRoutes');
app.use('/turnos', turnoRoutes);

const especialidadRoutes = require('./routes/especialidadRoutes');
app.use('/especialidades', especialidadRoutes);

const consultaRoutes = require('./routes/consultaMedicaRoutes');
app.use('/consultas', consultaRoutes);

const recetaRoutes = require('./routes/recetaRoutes');
app.use('/recetas', recetaRoutes);

const diagnosticoRoutes = require('./routes/diagnostico');
app.use('/diagnosticos', diagnosticoRoutes);