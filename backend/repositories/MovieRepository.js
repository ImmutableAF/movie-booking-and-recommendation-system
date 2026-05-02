const { sql, poolPromise } = require('../config/db');

class MovieRepository {
    static async getAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Movies');
        return result.recordset;
    }

    static async getGlobalRevenue() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM vw_GlobalRevenue');
        return result.recordset;
    }

    static async getOrphanScreenings() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM vw_OrphanScreenings');
        return result.recordset;
    }
}

module.exports = MovieRepository;