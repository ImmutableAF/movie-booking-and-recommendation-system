const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/available', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Seats WHERE id NOT IN (SELECT seatID FROM BookingSeats WHERE screeningID = 1)');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

module.exports = router;