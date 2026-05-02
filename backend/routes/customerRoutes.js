const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

router.get('/top-spenders', CustomerController.getTopSpenders);
router.get('/corporate', CustomerController.getCorporate);
router.get('/:id/history', CustomerController.getHistory);

module.exports = router;