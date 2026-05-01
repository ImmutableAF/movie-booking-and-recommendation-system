const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/count', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT screeningID, COUNT(*) AS TotalBookings FROM Bookings GROUP BY screeningID');
    res.json(result.recordset);
});

router.get('/popular', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT screeningID, COUNT(*) AS TotalBookings FROM Bookings GROUP BY screeningID HAVING COUNT(*) > 3');
    res.json(result.recordset);
});

router.get('/stats', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT COUNT(*) AS TotalBookings, SUM(total) AS TotalRevenue, AVG(total) AS AverageBookingValue, MAX(total) AS HighestBooking, MIN(total) AS LowestBooking FROM Bookings');
    res.json(result.recordset);
});

router.get('/both-screenings', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT customerID FROM Bookings WHERE screeningID = 1 INTERSECT SELECT customerID FROM Bookings WHERE screeningID = 2');
    res.json(result.recordset);
});

router.get('/only-screening-1', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT customerID FROM Bookings WHERE screeningID = 1 EXCEPT SELECT customerID FROM Bookings WHERE screeningID = 2');
    res.json(result.recordset);
});

module.exports = router;