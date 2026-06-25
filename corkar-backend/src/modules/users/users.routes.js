const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const adminOnly = require('../../middlewares/role.middleware');
const prisma = require('../../config/prisma');

router.use(auth);

router.get('/', adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, nombre: true, apellido: true,
        email: true, cedula: true, telefono: true,
        rol: true, createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, nombre: true, apellido: true,
        email: true, cedula: true, telefono: true, rol: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

module.exports = router;