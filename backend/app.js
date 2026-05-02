require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount Domain Routes (Commented out until we create them next)
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theatres', require('./routes/theatreRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

// Global Error Handler Boundary
app.use((err, req, res, next) => {
    console.error('[HTTP ERROR]', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 Fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found or method not allowed' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[API] Server running on http://localhost:${PORT}`);
});