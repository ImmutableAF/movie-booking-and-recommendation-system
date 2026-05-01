const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/union', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT name AS Item FROM Movies UNION SELECT location FROM Theatres');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;