// Requires
var express = require('express');

// Initialize variables
var app = express();

// ==================================================
// Try server
// ==================================================
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Working!!!'
    });
});

// Export
module.exports = app;