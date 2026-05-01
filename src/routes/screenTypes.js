const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.post('/', async (req, res) => {
    try{
        const { typeName } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('typeName', sql.NVarChar, typeName)
            .query('INSERT INTO ScreenTypes (typeName) VALUES (@typeName)');
        res.json({ message: 'Screen type added successfully' });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get('/', async (req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM ScreenTypes');
        res.json(result.recordset);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

module.exports = router;