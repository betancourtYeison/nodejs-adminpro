// Requires
var express = require('express');
var mongoose = require('mongoose');

// Initialize variables
var app = express();

// Conection DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('HospitalDB: \x1b[32m%s\x1b[0m', 'online');
})

// Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Working!!!'
    });
})

// Listen
app.listen(3000, () => {
    console.log('Listening on port: \x1b[32m%s\x1b[0m', '3000!');
});
  