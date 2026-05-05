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
        try {
            await pool.request()
                .input('BookingID', sql.Int, bookingId)
                .execute('dbo.CancelBooking');

            return { message: "Booking deleted successfully." };
        } catch (error) {
            if (error.number === 50001) {
                const err = new Error("Booking already deleted or does not exist.");
                err.statusCode = 404;
                throw err;
            }
            console.error(`[DB_EXEC_ERROR]`, error);
            throw new Error("An unexpected system error occurred.");
        }
    }
}

module.exports = BookingRepository;