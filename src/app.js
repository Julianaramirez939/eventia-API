const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

// Rutas
app.use('/events', require('./routes/event.routes'));
app.use('/participants', require('./routes/participant.routes'));
app.use('/attendance', require('./routes/attendance.routes'));
app.use(errorHandler);


module.exports = app;
