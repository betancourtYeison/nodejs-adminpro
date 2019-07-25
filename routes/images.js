// Requires
var express = require('express');

// Initialize variables
var app = express();

// Create constants
const path = require('path');
const fs = require('fs');

// ==================================================
// Function to get img
// ==================================================
app.get('/:type/:img', (req, res, next) => {
    var type = req.params.type;
    var img = req.params.img;
    var pathImg = path.resolve(__dirname, `../uploads/${type}/${img}`);
    
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }
});

// Export
module.exports = app;