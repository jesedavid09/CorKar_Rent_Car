// ============================================================
// config/cloudinary.js — Configuración de Cloudinary
// ------------------------------------------------------------
// Cloudinary almacena las imágenes de los vehículos en la nube
// y las sirve a través de su CDN global optimizado.
// ============================================================

const cloudinary       = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer           = require('multer');

// Configuramos Cloudinary con las credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuramos el storage de multer para subir directo a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'corkar/vehicles', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// Multer maneja la subida del archivo desde el request
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
});

module.exports = { cloudinary, upload };