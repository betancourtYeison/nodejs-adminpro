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

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Import routes
var appRoutes = require("./routes/app")
var loginRoutes = require("./routes/login")
var userRoutes = require("./routes/user")
var hospitalRoutes = require("./routes/hospital")
var doctorRoutes = require("./routes/doctor")
var searchRoutes = require("./routes/search")
var uploadRoutes = require("./routes/upload")
var imagesRoutes = require("./routes/images")

// Conection DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log('HospitalDB: \x1b[32m%s\x1b[0m', 'online');
})

// Routes
app.use('/images', imagesRoutes);
app.use('/upload', uploadRoutes);
app.use('/search', searchRoutes);
app.use('/doctor', doctorRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Listen
app.listen(3000, () => {
    console.log('Listening on port: \x1b[32m%s\x1b[0m', '3000!');
});
  