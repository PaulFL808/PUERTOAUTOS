require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./database');
const bcrypt = require('bcrypt');

// Importar modelos con asociaciones
require('./models'); 
const authRoutes = require('./routes/authRoutes');
const anunciosRoutes = require('./routes/anunciosRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/anuncios', anunciosRoutes);

// Archivos estáticos para fotos locales
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/api/v1', (req, res) => {
  res.json({ message: 'Bienvenido a la API de PUERTOAUTOS' });
});

// Inicializar el servidor y sincronizar BD
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida correctamente.');
    
    // Sincronizar modelos (alter en desarrollo)
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    // Seed del administrador
    const { Usuario } = require('./models');
    const adminExists = await Usuario.findOne({ where: { email: 'admin@puertoautos.cl' } });
    if (!adminExists) {
      await Usuario.create({
        nombre: 'Administrador',
        email: 'admin@puertoautos.cl',
        password: 'q1w2e3r4ferA',
        rol: 'admin'
      });
      console.log('Usuario administrador creado con éxito.');
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

startServer();
