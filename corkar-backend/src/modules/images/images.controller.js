// ============================================================
// images/images.controller.js — Lógica de imágenes
// ============================================================

const prisma             = require('../../config/prisma');
const { cloudinary }     = require('../../config/cloudinary');

// POST /api/images/vehicles/:vehicleId — subir imagen
const uploadImage = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { isPrimary }  = req.body;

    // req.file.path contiene la URL de Cloudinary
    // multer-storage-cloudinary la sube automáticamente
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen' });
    }

    // Si es imagen primaria, quitamos el flag a las demás
    if (isPrimary === 'true') {
      await prisma.vehicleImage.updateMany({
        where: { vehicleId },
        data:  { isPrimary: false }
      });
    }

    // Contamos cuántas imágenes tiene el vehículo para el orden
    const count = await prisma.vehicleImage.count({ where: { vehicleId } });

    const image = await prisma.vehicleImage.create({
      data: {
        vehicleId,
        url:       req.file.path,
        isPrimary: isPrimary === 'true' || count === 0, // Primera imagen = primaria
        orden:     count,
      }
    });

    res.status(201).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error subiendo imagen' });
  }
};

// DELETE /api/images/:imageId — eliminar imagen
const deleteImage = async (req, res) => {
  try {
    const image = await prisma.vehicleImage.findUnique({
      where: { id: req.params.imageId }
    });

    if (!image) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Extraemos el public_id de Cloudinary desde la URL
    // URL ejemplo: https://res.cloudinary.com/cloud/image/upload/v123/corkar/vehicles/abc123.jpg
    const urlParts  = image.url.split('/');
    const fileName  = urlParts[urlParts.length - 1].split('.')[0];
    const publicId  = `corkar/vehicles/${fileName}`;

    // Eliminamos de Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Eliminamos de la base de datos
    await prisma.vehicleImage.delete({ where: { id: req.params.imageId } });

    res.json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando imagen' });
  }
};

// PATCH /api/images/:imageId/primary — marcar como imagen principal
const setPrimary = async (req, res) => {
  try {
    const image = await prisma.vehicleImage.findUnique({
      where: { id: req.params.imageId }
    });

    if (!image) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Quitamos isPrimary a todas las imágenes del vehículo
    await prisma.vehicleImage.updateMany({
      where: { vehicleId: image.vehicleId },
      data:  { isPrimary: false }
    });

    // Marcamos esta como primaria
    const updated = await prisma.vehicleImage.update({
      where: { id: req.params.imageId },
      data:  { isPrimary: true }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando imagen principal' });
  }
};

module.exports = { uploadImage, deleteImage, setPrimary };