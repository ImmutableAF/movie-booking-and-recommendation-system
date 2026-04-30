const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connection Secured with SQL Server');
        return pool;
    })
    .catch(err => {
        console.log('Connection Failed: ', err);
    });

module.exports = {
    sql, poolPromise
};