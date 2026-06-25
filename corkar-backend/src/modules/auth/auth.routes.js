// ============================================================
// auth/auth.routes.js — Rutas de autenticación
// ------------------------------------------------------------
// Define los endpoints públicos de autenticación.
// Estas rutas NO requieren token porque son el punto de entrada
// al sistema (el usuario aún no tiene token cuando se registra
// o inicia sesión).
//
// Base URL: /api/auth
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('./auth.controller');

// POST /api/auth/register → registrar un nuevo cliente
router.post('/register', controller.register);

// POST /api/auth/login → iniciar sesión y obtener token JWT
router.post('/login', controller.login);

module.exports = router;