const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Movies');
    res.json(result.recordset);
});

router.post('/', async (req, res) => {
    const { name, releaseYear } = req.body;
    const pool = await poolPromise;
    await pool.request()
        .input('name', sql.NVarChar, name)
        .input('releaseYear', sql.SmallInt, releaseYear)
        .query('INSERT INTO Movies (name, releaseYear) VALUES (@name, @releaseYear)');
    res.json({ message: 'Movie added successfully' });
});

router.get('/recent', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT name, releaseYear FROM Movies WHERE releaseYear > 2015');
    res.json(result.recordset);
});

router.get('/sorted', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Movies ORDER BY releaseYear DESC');
    res.json(result.recordset);
});

router.get('/with-screenings', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT m.name, s.startTime FROM Movies m LEFT JOIN Screenings s ON m.id = s.movieID');
    res.json(result.recordset);
});

router.get('/revenue', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT m.name, SUM(b.total) AS MovieRevenue FROM Bookings b JOIN Screenings s ON b.screeningID = s.id JOIN Movies m ON s.movieID = m.id GROUP BY m.name ORDER BY MovieRevenue DESC');
    res.json(result.recordset);
});

module.exports = router;