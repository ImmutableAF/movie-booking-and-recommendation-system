const { sql, poolPromise } = require('../config/db');

class TheatreRepository {
    static async getOccupancy() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM vw_ScreeningOccupancy');
        return result.recordset;
    }

    static async getRevenueByType() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM vw_RevenueByScreenType');
        return result.recordset;
    }

    static async getAvailableSeats(screeningId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ScreeningID', sql.Int, screeningId)
            .execute('sp_GetAvailableSeats');
        return result.recordset;
    }
}

module.exports = TheatreRepository;