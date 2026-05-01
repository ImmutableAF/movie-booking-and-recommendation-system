const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request()
    .query('SELECT * FROM Movies');
    res.json(result.recordset);
});

module.exports = router;