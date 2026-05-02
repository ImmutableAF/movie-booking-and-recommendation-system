const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');

router.post('/', BookingController.createBooking);
router.delete('/:id', BookingController.cancelBooking);

module.exports = router;