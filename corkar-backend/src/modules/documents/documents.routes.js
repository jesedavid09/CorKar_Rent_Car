const express    = require('express');
const router     = express.Router();
const controller = require('./documents.controller');
const auth       = require('../../middlewares/auth.middleware');

router.use(auth);

router.get('/quotation/:reservationId', controller.generateQuotation);
router.get('/contract/:reservationId',  controller.generateContract);

module.exports = router;