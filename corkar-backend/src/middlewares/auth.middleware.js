// ============================================================
// middlewares/auth.middleware.js — Verificación de JWT
// ------------------------------------------------------------
// Un middleware es una función que se ejecuta ENTRE que llega
// la petición y que la maneja el controller. Funciona como un
// guardia en la puerta: si el token es válido, deja pasar;
// si no, rechaza la petición con un error 401.
//
// Uso en rutas: router.get('/ruta', authMiddleware, controller)
// ============================================================

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Los tokens JWT se envían en el header Authorization con el
  // formato: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers['authorization'];

  // Si no viene ningún header de autorización, rechazamos la petición
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // Separamos "Bearer" del token real usando split(' ')
  // authHeader = "Bearer abc123" → token = "abc123"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    // jwt.verify valida la firma del token y su fecha de expiración.
    // Si el token fue alterado o expiró, lanza un error automáticamente.
    // JWT_SECRET es la clave secreta definida en .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos decodificados en req.user para que el
    // controller pueda acceder al id, email y rol del usuario
    req.user = decoded;

    // next() le indica a Express que continúe al siguiente
    // middleware o al controller de la ruta
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;