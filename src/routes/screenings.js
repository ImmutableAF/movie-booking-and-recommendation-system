const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/with-movies', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT m.name AS MovieName, s.startTime, s.endTime FROM Screenings s JOIN Movies m ON s.movieID = m.id');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get('/with-movies-all', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT m.name, s.startTime FROM Movies m RIGHT JOIN Screenings s ON m.id = s.movieID');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get('/all-combined', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT m.name, s.startTime FROM Movies m FULL OUTER JOIN Screenings s ON m.id = s.movieID');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

module.exports = router;