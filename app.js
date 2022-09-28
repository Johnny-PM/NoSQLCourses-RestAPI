const express = require('express');
const app = express();
const patientsRoutes = require('./api/routes/patients');
const appointmentsRoutes = require('./api/routes/appointments');
const bodyParser = require('body-parser'); // Extract Data from body in requests

// Setting the bodyParser on the App
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Allow the access to the API from other sites
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routing
app.use('/patients', patientsRoutes);
app.use('/appointments', appointmentsRoutes);


// Error Messages
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;
