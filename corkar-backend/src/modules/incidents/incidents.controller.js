const prisma = require('../../config/prisma');

const create = async (req, res) => {
  try {
    const { reservationId, tipo, descripcion, fotoUrl } = req.body;

    const reservation = await prisma.reservation.findFirst({
      where: { id: reservationId, userId: req.user.id }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const incident = await prisma.incident.create({
      data: { reservationId, tipo, descripcion, fotoUrl }
    });

    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear incidente' });
  }
};

const getAll = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        reservation: {
          include: {
            user:    { select: { nombre: true, apellido: true } },
            vehicle: { select: { marca: true, modelo: true, placa: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener incidentes' });
  }
};

const updateEstado = async (req, res) => {
  try {
    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data:  { estado: req.body.estado }
    });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar incidente' });
  }
};

module.exports = { create, getAll, updateEstado };