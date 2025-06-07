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

