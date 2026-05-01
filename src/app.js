const express = require('express');

const app = express();
app.use(express.json());


const moviesRouter = require('./routes/movies');
app.use('/movies', moviesRouter);

module.exports = app;