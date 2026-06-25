// ============================================================
// auth/auth.controller.js — Lógica de autenticación
// ------------------------------------------------------------
// Contiene las funciones que manejan el registro y login.
// Principios de seguridad aplicados:
// - Las contraseñas se encriptan con bcrypt antes de guardar
// - Nunca se devuelve el hash de la contraseña al cliente
// - Los mensajes de error son genéricos para no revelar info
// - Los tokens JWT tienen fecha de expiración
// ============================================================

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const prisma = require('../../config/prisma');

// ── REGISTER ──────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, cedula } = req.body;

    // Verificamos que el email no esté ya registrado.
    // Email es único en la BD (constraint @unique en el schema)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // bcrypt.hash encripta la contraseña con un "salt" de costo 10.
    // El costo determina cuántas iteraciones hace el algoritmo:
    // más alto = más seguro pero más lento. 10 es el estándar en producción.
    // NUNCA guardamos contraseñas en texto plano en la base de datos.
    const passwordHash = await bcrypt.hash(password, 10);

    // Creamos el usuario. El campo `select` limita qué campos
    // devuelve Prisma — excluimos passwordHash por seguridad.
    const user = await prisma.user.create({
      data: { nombre, apellido, email, passwordHash, telefono, cedula },
      select: { id: true, nombre: true, apellido: true, email: true, rol: true }
    });

    // Generamos el JWT para que el cliente quede autenticado
    // automáticamente después del registro sin necesidad de hacer login.
    // El payload contiene solo los datos necesarios para identificar al usuario.
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,       // Clave secreta del .env
      { expiresIn: process.env.JWT_EXPIRES_IN } // Tiempo de expiración (ej: "7d")
    );

    // 201 Created: indica que se creó un nuevo recurso exitosamente
    res.status(201).json({ user, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos el usuario por email incluyendo el hash
    // para poder compararlo con la contraseña recibida
    const user = await prisma.user.findUnique({ where: { email } });

    // Usamos el mismo mensaje para email incorrecto y contraseña incorrecta.
    // Si dijéramos "email no encontrado", un atacante sabría qué emails existen.
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // bcrypt.compare compara la contraseña en texto plano con el hash guardado.
    // Internamente aplica el mismo algoritmo y verifica si coinciden.
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generamos el token JWT con los datos del usuario
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Desestructuramos el objeto para excluir passwordHash de la respuesta.
    // El operador rest (...userSafe) toma todas las propiedades excepto passwordHash.
    const { passwordHash, ...userSafe } = user;
    res.json({ user: userSafe, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };