const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');

router.get('/', MovieController.getAll);
router.get('/revenue', MovieController.getRevenue);
router.get('/orphans', MovieController.getOrphans);

module.exports = router;