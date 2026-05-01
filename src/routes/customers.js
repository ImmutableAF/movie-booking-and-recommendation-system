const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Customers WHERE id = @id');
        res.json({ message: 'Customer deleted successfully' });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get('/search', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Customers WHERE name LIKE 'A%'");
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get('/high-spenders', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Customers WHERE id IN (SELECT customerID FROM Bookings WHERE total > (SELECT AVG(total) FROM Bookings))');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

module.exports = router;