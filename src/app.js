const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());
 
const moviesRouter = require('./routes/movies');
const theatresRouter = require('./routes/theatres');
const screenTypesRouter = require('./routes/screenTypes');
const customersRouter = require('./routes/customers');
const screeningsRouter = require('./routes/screenings');
const bookingsRouter = require('./routes/bookings');
const seatsRouter = require('./routes/seats');
const combinedRouter = require('./routes/combined');

app.use('/movies', moviesRouter);
app.use('/theatres', theatresRouter);
app.use('/screen-types', screenTypesRouter);
app.use('/customers', customersRouter);
app.use('/screenings', screeningsRouter);
app.use('/bookings', bookingsRouter);
app.use('/seats', seatsRouter);
app.use('/combined', combinedRouter);

module.exports = app;