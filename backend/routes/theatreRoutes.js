const express = require('express');
const router = express.Router();
const TheatreController = require('../controllers/TheatreController');

router.get('/occupancy', TheatreController.getOccupancy);
router.get('/revenue-by-type', TheatreController.getRevenueByType);
router.get('/:screeningId/available-seats', TheatreController.getAvailableSeats);

module.exports = router;