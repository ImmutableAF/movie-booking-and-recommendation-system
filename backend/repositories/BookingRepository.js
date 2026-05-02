const { sql, poolPromise } = require('../config/db');

class BookingRepository {
    static async processBooking(customerId, screeningId, seatId) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CustomerID', sql.Int, customerId)
            .input('ScreeningID', sql.Int, screeningId)
            .input('SeatID', sql.Int, seatId)
            .execute('sp_ProcessBooking');
        return result.recordset[0]; // Returns { SuccessBookingID: X }
    }

    static async cancelBooking(bookingId) {
        const pool = await poolPromise;
        await pool.request()
            .input('BookingID', sql.Int, bookingId)
            .execute('sp_CancelBooking');
        return true;
    }
}

module.exports = BookingRepository;