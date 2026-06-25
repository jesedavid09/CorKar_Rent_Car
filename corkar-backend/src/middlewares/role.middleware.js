// ============================================================
// middlewares/role.middleware.js — Verificación de rol ADMIN
// ------------------------------------------------------------
// Este middleware se usa DESPUÉS de authMiddleware, nunca solo.
// authMiddleware verifica que el usuario esté autenticado,
// y roleMiddleware verifica que además tenga rol de ADMIN.
//
// Uso en rutas: router.post('/', auth, adminOnly, controller)
// Error 403 Forbidden: autenticado pero sin permisos suficientes
// ============================================================

const roleMiddleware = (req, res, next) => {
  // req.user fue asignado por authMiddleware en el paso anterior.
  // Si llegamos aquí sin pasar por authMiddleware, req.user sería
  // undefined y el servidor lanzaría un error — por eso siempre
  // deben usarse juntos: [auth, adminOnly]
  if (req.user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol ADMIN' });
  }

  // El usuario es ADMIN, puede continuar
  next();
};

module.exports = roleMiddleware;