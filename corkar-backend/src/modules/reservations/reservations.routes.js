const express    = require('express');
const router     = express.Router();
const controller = require('./reservations.controller');
const auth       = require('../../middlewares/auth.middleware');
const adminOnly  = require('../../middlewares/role.middleware');

router.use(auth);

router.post('/',                       controller.create);
router.get('/mis-reservas',            controller.getMyReservations);
router.get('/',           adminOnly,   controller.getAll);
router.patch('/:id/estado', adminOnly, controller.updateEstado);

module.exports = router;