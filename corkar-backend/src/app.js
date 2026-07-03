// ============================================================
// app.js — Punto de entrada del servidor CorKar
// ------------------------------------------------------------
// Este archivo es el núcleo de la aplicación. Se encarga de:
// 1. Crear la instancia de Express
// 2. Configurar los middlewares globales
// 3. Registrar todas las rutas de la API
// 4. Manejar errores globales
// 5. Iniciar el servidor en el puerto definido
// ============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Carga las variables del archivo .env (DATABASE_URL, JWT_SECRET, etc.)
// Debe llamarse lo antes posible para que estén disponibles en todo el código
const app = express();

// ── Middlewares globales ──────────────────────────────────────
// CORS: permite que el frontend (en otro origen/puerto) haga
// peticiones a esta API sin ser bloqueado por el navegador
app.use(cors());

// express.json(): permite recibir y parsear cuerpos JSON en las
// peticiones (req.body). Sin esto, req.body sería undefined
app.use(express.json());
app.use((req, res, next) => {
  console.log('Body:', req.body);
  console.log('Headers:', req.headers['content-type']);
  next();
});

// ── Registro de rutas ─────────────────────────────────────────
// Cada módulo maneja sus propias rutas. El prefijo /api/[módulo]
// es una convención REST que agrupa los endpoints por recurso.
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/users', require('./modules/users/users.routes'));
app.use('/api/vehicles', require('./modules/vehicles/vehicles.routes'));
app.use('/api/reservations', require('./modules/reservations/reservations.routes'));
app.use('/api/incidents', require('./modules/incidents/incidents.routes'));
app.use('/api/documents', require('./modules/documents/documents.routes'));

// ── Health Check ──────────────────────────────────────────────
// Ruta pública que confirma que el servidor está activo.
// Útil para monitoreo y para verificar el despliegue en producción.
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CorKar API funcionando' });
});

// ── Manejador de rutas no encontradas (404) ───────────────────
// Si ninguna ruta anterior coincidió con la petición,
// este middleware la captura y devuelve un error claro.
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Manejador global de errores (500) ────────────────────────
// Express identifica este middleware por tener 4 parámetros (err, req, res, next).
// Captura cualquier error lanzado con next(error) en los controllers.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Iniciar servidor ──────────────────────────────────────────
// Si PORT no está definido en .env, usa 3000 como valor por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Ruta para obtener categorías de vehículos
app.get('/api/vehicle-categories', async (req, res) => {
  const prisma = require('./config/prisma');
  try {
    const categories = await prisma.vehicleCategory.findMany({
      orderBy: { nombre: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo categorías' });
  }
});