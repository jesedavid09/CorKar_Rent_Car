// ============================================================
// images/images.routes.js — Rutas de subida de imágenes
// ============================================================

const express    = require('express');
const router     = express.Router();
const controller = require('./images.controller');
const auth       = require('../../middlewares/auth.middleware');
const adminOnly  = require('../../middlewares/role.middleware');
const { upload } = require('../../config/cloudinary');

// Solo el admin puede subir y eliminar imágenes
// upload.single('image') procesa un archivo del campo "image"
router.post(
  '/vehicles/:vehicleId',
  auth,
  adminOnly,
  upload.single('image'),
  controller.uploadImage
);

router.delete(
  '/:imageId',
  auth,
  adminOnly,
  controller.deleteImage
);

router.patch(
  '/:imageId/primary',
  auth,
  adminOnly,
  controller.setPrimary
);

module.exports = router;