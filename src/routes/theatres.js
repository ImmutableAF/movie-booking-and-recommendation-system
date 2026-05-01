const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.post('/', async (req, res) => {
    const { location } = req.body;
    const pool = await poolPromise;
    await pool.request()
        .input('location', sql.NVarChar, location)
        .query('INSERT INTO Theatres (location) VALUES (@location)');
    res.json({ message: 'Theatre added successfully' });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { location } = req.body;
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .input('location', sql.NVarChar, location)
        .query('UPDATE Theatres SET location = @location WHERE id = @id');
    res.json({ message: 'Theatre updated successfully' });
});

router.get('/with-screens', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT sc.screenName, t.location FROM Screens sc JOIN Theatres t ON sc.theatreID = t.id');
    res.json(result.recordset);
});

router.get('/screen-count', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT t.location, COUNT(sc.id) AS NumberOfScreens FROM Theatres t JOIN Screens sc ON t.id = sc.theatreID GROUP BY t.location');
    res.json(result.recordset);
});

module.exports = router;