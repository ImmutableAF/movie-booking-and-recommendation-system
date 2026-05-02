const TheatreRepository = require('../repositories/TheatreRepository');

class TheatreController {
    static async getOccupancy(req, res, next) {
        try {
            const data = await TheatreRepository.getOccupancy();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async getRevenueByType(req, res, next) {
        try {
            const data = await TheatreRepository.getRevenueByType();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async getAvailableSeats(req, res, next) {
        try {
            const screeningId = parseInt(req.params.screeningId, 10);
            if (isNaN(screeningId)) {
                return res.status(400).json({ error: "Invalid screening ID. Must be an integer." });
            }
            const data = await TheatreRepository.getAvailableSeats(screeningId);
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = TheatreController;