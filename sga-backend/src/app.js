const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const classRoutes = require('./routes/classRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando' });
});

// Rutas
app.use('/auth', authRoutes);
app.use('/subjects', subjectRoutes);
app.use('/classes', classRoutes);
app.use('/enrollments', enrollmentRoutes);

// Sincronizar DB al levantar la app (solo para desarrollo)
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    await sequelize.sync({ alter: true }); // cuidado en producción
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al conectar/sincronizar la base de datos:', error);
  }
}

initDatabase();

module.exports = app;
