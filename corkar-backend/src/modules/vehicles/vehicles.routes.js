// ============================================================
// vehicles/vehicles.routes.js — Rutas de vehículos
// ------------------------------------------------------------
// Divide las rutas en dos grupos:
// - Públicas: cualquier visitante puede ver el catálogo
// - Protegidas: solo el ADMIN puede crear, editar o eliminar
//
// Base URL: /api/vehicles
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('./vehicles.controller');
const auth       = require('../../middlewares/auth.middleware');
const adminOnly  = require('../../middlewares/role.middleware');

// ── Rutas públicas (sin token) ────────────────────────────────
// GET /api/vehicles        → catálogo completo con filtros opcionales
// GET /api/vehicles/:id    → detalle de un vehículo específico
router.get('/',    controller.getAll);
router.get('/:id', controller.getById);

// ── Rutas protegidas (requieren token + rol ADMIN) ────────────
// POST   /api/vehicles      → crear vehículo nuevo
// PUT    /api/vehicles/:id  → editar vehículo existente
// DELETE /api/vehicles/:id  → eliminar vehículo
router.post('/',      auth, adminOnly, controller.create);
router.put('/:id',    auth, adminOnly, controller.update);
router.delete('/:id', auth, adminOnly, controller.remove);

module.exports = router;