const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.post('/', async (req, res) => {
    const {name, releaseYear} = req.body;
    const pool = await poolPromise;
    const result = await pool
    .request()
    .input('name', sql.NVarChar, name)
    .input('releaseYear', sql.SmallInt, releaseYear)
    .query(
        'INSERT INTO Movies (name, releaseYear) VALUES (@name, @releaseYear)'
    );
    res.json({message: 'Movie added successfully'});
});

module.exports = router;
