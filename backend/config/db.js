const sql = require('mssql');
//require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log(`[DB] Connected via TCP/IP to ${process.env.DB_SERVER}:${process.env.DB_PORT} -> ${process.env.DB_NAME}`);
        return pool;
    })
    .catch(err => {
        console.error('[DB] Database Connection Failed.', err);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};