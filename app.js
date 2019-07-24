// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Initialize variables
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Import routes
var appRoutes = require("./routes/app")
var userRoutes = require("./routes/user")
var loginRoutes = require("./routes/login")

// Conection DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('HospitalDB: \x1b[32m%s\x1b[0m', 'online');
})

// Routes
app.use('/login', loginRoutes);
app.use('/user', userRoutes);
app.use('/', appRoutes);

// Listen
app.listen(3000, () => {
    console.log('Listening on port: \x1b[32m%s\x1b[0m', '3000!');
});
  