const MovieRepository = require('../repositories/MovieRepository');

class MovieController {
    static async getAll(req, res, next) {
        try {
            const data = await MovieRepository.getAll();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async getRevenue(req, res, next) {
        try {
            const data = await MovieRepository.getGlobalRevenue();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async getOrphans(req, res, next) {
        try {
            const data = await MovieRepository.getOrphanScreenings();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MovieController;