const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.post('/', async (req, res) => {
    const { typeName } = req.body;
    const pool = await poolPromise;
    await pool.request()
        .input('typeName', sql.NVarChar, typeName)
        .query('INSERT INTO ScreenTypes (typeName) VALUES (@typeName)');
    res.json({ message: 'Screen type added successfully' });
});

router.get('/', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ScreenTypes');
    res.json(result.recordset);
});

module.exports = router;