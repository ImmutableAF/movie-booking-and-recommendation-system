const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Customers WHERE id = @id');
    res.json({ message: 'Customer deleted successfully' });
});

router.get('/search', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Customers WHERE name LIKE 'A%'");
    res.json(result.recordset);
});

router.get('/high-spenders', async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Customers WHERE id IN (SELECT customerID FROM Bookings WHERE total > (SELECT AVG(total) FROM Bookings))');
    res.json(result.recordset);
});

module.exports = router;