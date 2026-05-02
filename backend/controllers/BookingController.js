const BookingRepository = require('../repositories/BookingRepository');

class BookingController {
    static async createBooking(req, res, next) {
        try {
            const { customerId, screeningId, seatId } = req.body;

            if (!Number.isInteger(customerId) || !Number.isInteger(screeningId) || !Number.isInteger(seatId)) {
                return res.status(400).json({ error: "customerId, screeningId, and seatId must be valid integers." });
            }

            const data = await BookingRepository.processBooking(customerId, screeningId, seatId);
            res.status(201).json({ message: "Booking processed successfully", data });
        } catch (err) {
            // Check for specific custom SQL exception codes (e.g., our 50001 constraint throw)
            if (err.number === 50001) {
                return res.status(409).json({ error: err.message }); // 409 Conflict
            }
            next(err);
        }
    }

    static async cancelBooking(req, res, next) {
        try {
            const bookingId = parseInt(req.params.id, 10);
            if (isNaN(bookingId)) {
                return res.status(400).json({ error: "Invalid Booking ID." });
            }

            await BookingRepository.cancelBooking(bookingId);
            res.status(200).json({ message: `Booking ${bookingId} cancelled successfully` });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = BookingController;