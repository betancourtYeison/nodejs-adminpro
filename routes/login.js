// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Initialize variables
var app = express();

// Import model
var User = require("../models/user");

app.post('/', (req, res, next) => {
    var body = req.body;

    User.findOne({email: body.email}, (err, user) => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Error finding user',
                errors: err
            });
        }

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'Incorrect credentials - email',
            });
        }

        if(!bcrypt.compareSync(body.password, user.password)){
            return res.status(400).json({
                success: false,
                message: 'Incorrect credentials - passowrd',
            });
        }

        // Create token
        user.password = ':)';
        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            success: true,
            user: user,
            token: token,
            id: user.id
        });
    });
});

// Export
module.exports = app;