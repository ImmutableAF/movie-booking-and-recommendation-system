const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/count', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT screeningID, COUNT(*) AS TotalBookings FROM Bookings GROUP BY screeningID');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/popular', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT screeningID, COUNT(*) AS TotalBookings FROM Bookings GROUP BY screeningID HAVING COUNT(*) > 3');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/stats', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT COUNT(*) AS TotalBookings, SUM(total) AS TotalRevenue, AVG(total) AS AverageBookingValue, MAX(total) AS HighestBooking, MIN(total) AS LowestBooking FROM Bookings');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/both-screenings', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT customerID FROM Bookings WHERE screeningID = 1 INTERSECT SELECT customerID FROM Bookings WHERE screeningID = 2');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/only-screening-1', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT customerID FROM Bookings WHERE screeningID = 1 EXCEPT SELECT customerID FROM Bookings WHERE screeningID = 2');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post('/book-seat', async (req, res) => {
    const { seatId, screeningId, customerId, priceId } = req.body;
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        const seatCheck = await request
            .input('seatId', sql.Int, seatId)
            .input('screeningId', sql.Int, screeningId)
            .query(`
                SELECT * FROM BookingSeats WITH (UPDLOCK, ROWLOCK)
                WHERE seatID = @seatId AND screeningID = @screeningId
            `);

        if (seatCheck.recordset.length > 0) {
            await transaction.rollback();
            return res.status(409).json({ error: 'Seat already booked' });
        }

        const booking = await request
            .input('customerId', sql.Int, customerId)
            .input('priceId', sql.Int, priceId)
            .query(`
                INSERT INTO Bookings (total, customerID, screeningID, priceID)
                VALUES ((SELECT basePrice FROM TicketPrices WHERE id = @priceId), @customerId, @screeningId, @priceId);
                SELECT SCOPE_IDENTITY() AS bookingId;
            `);

        const bookingId = booking.recordset[0].bookingId;

        await request
            .input('bookingId', sql.Int, bookingId)
            .query(`
                INSERT INTO BookingSeats (bookingID, seatID, screeningID)
                VALUES (@bookingId, @seatId, @screeningId)
            `);

        await transaction.commit();
        res.json({ message: 'Seat booked successfully!' });

    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;