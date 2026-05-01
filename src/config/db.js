const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=yes;`
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