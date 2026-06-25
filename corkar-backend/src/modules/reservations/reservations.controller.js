const prisma = require('../../config/prisma');

const create = async (req, res) => {
  try {
    const { vehicleId, fechaInicio, fechaFin, notas } = req.body;
    const userId = req.user.id;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle || vehicle.estado !== 'DISPONIBLE') {
      return res.status(400).json({ error: 'Vehículo no disponible' });
    }

    const inicio    = new Date(fechaInicio);
    const fin       = new Date(fechaFin);
    const diasTotal = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));

    if (diasTotal <= 0) {
      return res.status(400).json({ error: 'Las fechas son inválidas' });
    }

    const costoTotal = diasTotal * Number(vehicle.precioDia);

    const reservation = await prisma.reservation.create({
      data: { userId, vehicleId, notas, fechaInicio: inicio, fechaFin: fin, diasTotal, costoTotal },
      include: {
        vehicle: true,
        user: { select: { nombre: true, email: true } }
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where:   { userId: req.user.id },
      include: {
        vehicle: {
          include: { images: { where: { isPrimary: true }, take: 1 } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const getAll = async (req, res) => {
  try {
    const { estado } = req.query;
    const reservations = await prisma.reservation.findMany({
      where:   { ...(estado && { estado }) },
      include: {
        user:    { select: { nombre: true, apellido: true, email: true } },
        vehicle: { select: { marca: true, modelo: true, placa: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const updateEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['APROBADA','RECHAZADA','ACTIVA','COMPLETADA','CANCELADA'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    const reservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data:  { estado }
    });

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

module.exports = { create, getMyReservations, getAll, updateEstado };