const { sql, poolPromise } = require('../config/db');

class CustomerRepository {
    static async getTopSpenders() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM vw_TopCustomers');
        return result.recordset;
    }

    static async getCorporate() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM vw_CorporateCustomers');
        return result.recordset;
    }

    static async getHistory(customerId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CustomerID', sql.Int, customerId)
            .execute('sp_GetCustomerHistory');
        return result.recordset;
    }
}

module.exports = CustomerRepository;