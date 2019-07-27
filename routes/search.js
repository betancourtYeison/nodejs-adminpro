// Requires
var express = require('express');

// Initialize variables
var app = express();

// Import models
var Hospital = require('../models/hospital')
var Doctor = require('../models/doctor')
var User = require('../models/user')

// ==================================================
// Function to search in models
// ==================================================
app.get('/collection/:model/:search', (req, res, next) => {
    var model = req.params.model;
    var search = req.params.search;
    var regex = new RegExp(search, 'i');
    var promise = null
    switch (model) {
        case 'hospitals':
            promise = searchHospitals(regex)
            break;
        case 'doctors':
            promise = searchDoctors(regex)
            break;
        case 'users':
            promise = searchUsers(regex)
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Error model no found: [hospitals, doctors, users]',
            });
    }

    promise
        .then(response => {
            res.status(200).json({
                success: true,
                [model]: response
            });
        }).catch(err => {
            res.status(500).json({
                success: false,
                message: 'Error searching',
                errors: err
            });
        });
});

// ==================================================
// Function to search all
// ==================================================
app.get('/all/:search', (req, res, next) => {
    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise
        .all([searchHospitals(regex), searchDoctors(regex), searchUsers(regex)])
        .then(response => {
            res.status(200).json({
                success: true,
                hospitals: response[0],
                doctors: response[1],
                users: response[2]
            });
        }).catch(err => {
            res.status(500).json({
                success: false,
                message: 'Error searching',
                errors: err
            });
        });
        
});

function searchHospitals(regex){
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex })
            .populate('user', 'name email img role google')
            .exec((err, hospitals) => {
                if(err){
                    reject('Error searching in hospitals:', err);
                }else{
                    resolve(hospitals);
                }
            });
    });
};

function searchDoctors(regex){
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex })
            .populate('user', 'name email img role google')
            .populate('hospital')
            .exec((err, doctors) => {
                if(err){
                    reject('Error searching in doctors:', err);
                }else{
                    resolve(doctors);
                }
            });
    });
};

function searchUsers(regex){
    return new Promise((resolve, reject) => {
        User.find({}, 'name email img role google')
            .or([{ name: regex }, { email: regex }])
            .exec((err, users) => {
                if(err){
                    reject('Error searching in users:', err);
                }else{
                    resolve(users);
                }
            });
    });
};

// Export
module.exports = app;