const CustomerRepository = require('../repositories/CustomerRepository');

class CustomerController {
    static async getTopSpenders(req, res, next) {
        try {
            const data = await CustomerRepository.getTopSpenders();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async getCorporate(req, res, next) {
        try {
            const data = await CustomerRepository.getCorporate();
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }

    static async getHistory(req, res, next) {
        try {
            const customerId = parseInt(req.params.id, 10);
            if (isNaN(customerId)) {
                return res.status(400).json({ error: "Invalid Customer ID." });
            }
            const data = await CustomerRepository.getHistory(customerId);
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CustomerController;