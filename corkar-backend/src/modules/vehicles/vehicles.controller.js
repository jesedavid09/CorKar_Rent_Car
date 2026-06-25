// ============================================================
// vehicles/vehicles.controller.js — Lógica de vehículos
// ------------------------------------------------------------
// Maneja el CRUD completo de vehículos.
// getAll soporta filtros opcionales por query params:
//   ?categoria=uuid&transmision=AUTOMATICA&precioMax=100&estado=DISPONIBLE
// ============================================================

const prisma = require('../../config/prisma');

// GET /api/vehicles — Lista todos los vehículos con filtros opcionales
const getAll = async (req, res) => {
  try {
    // Los query params llegan en req.query como strings
    // Ejemplo: /api/vehicles?estado=DISPONIBLE&precioMax=50
    const { categoria, transmision, precioMax, estado } = req.query;

    const vehicles = await prisma.vehicle.findMany({
      where: {
        // El spread condicional (...condición && { campo: valor })
        // solo agrega el filtro si el parámetro fue enviado.
        // Así evitamos filtrar por campos que no se especificaron.
        ...(categoria   && { categoryId: categoria }),
        ...(transmision && { transmision }),
        ...(estado      && { estado }),
        // lte = "less than or equal" (menor o igual que)
        ...(precioMax   && { precioDia: { lte: parseFloat(precioMax) } }),
      },
      include: {
        // Incluimos la categoría para mostrar su nombre en el catálogo
        category: true,
        // Solo traemos la imagen principal para no sobrecargar
        // la respuesta cuando hay muchos vehículos en el catálogo
        images: { where: { isPrimary: true }, take: 1 }
      },
      orderBy: { createdAt: 'desc' } // Más recientes primero
    });

    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
};

// GET /api/vehicles/:id — Detalle completo de un vehículo
const getById = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where:   { id: req.params.id },
      include: {
        category: true,
        // En el detalle sí traemos TODAS las imágenes, ordenadas
        images: { orderBy: { orden: 'asc' } }
      }
    });

    // Si no existe el vehículo con ese ID, devolvemos 404
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener vehículo' });
  }
};

// POST /api/vehicles — Crear vehículo nuevo (solo ADMIN)
const create = async (req, res) => {
  try {
    // req.body contiene todos los campos del vehículo enviados por el admin
    const vehicle = await prisma.vehicle.create({ data: req.body });
    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear vehículo' });
  }
};

// PUT /api/vehicles/:id — Editar vehículo (solo ADMIN)
const update = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data:  req.body // Solo actualiza los campos que vienen en el body
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar vehículo' });
  }
};

// DELETE /api/vehicles/:id — Eliminar vehículo (solo ADMIN)
const remove = async (req, res) => {
  try {
    // Las imágenes se eliminan automáticamente por el onDelete: Cascade
    // que definimos en el schema de VehicleImage
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.json({ message: 'Vehículo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
};

module.exports = { getAll, getById, create, update, remove };