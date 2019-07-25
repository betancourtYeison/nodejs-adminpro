// Requires
var express = require('express');
var mdAuthenticate = require('../middlewares/authenticate');

// Initialize variables
var app = express();

// Import model
var Doctor = require("../models/doctor");

// ==================================================
// Get all Doctors
// ==================================================
app.get('/', (req, res, next) => {
    var from = req.query.from || 0;
    from = Number(from);

    Doctor.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, doctors) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Error finding doctor',
                    errors: err
                });
            }

            Doctor.count({}, (err, total) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: 'Error counting doctors',
                        errors: err
                    });
                }

                res.status(200).json({
                    success: true,
                    doctors: doctors,
                    total: total
                });
            });
        })
});

// ==================================================
// Create new doctor
// ==================================================
app.post('/', mdAuthenticate.verifyToken, (req, res, next) => {
    var body = req.body;
    var doctor = new Doctor({
        name: body.name,
        img: body.img,
        user: req.user._id,
        hospital: body.hospital
    });
    
    doctor.save((err, doctorSaved) => {
        if(err){
            return res.status(400).json({
                success: false,
                message: 'Error creating doctor',
                errors: err
            });
        }

        res.status(201).json({
            success: true,
            doctor: doctorSaved
        });
    });
});

// ==================================================
// Update an doctor
// ==================================================
app.put('/:id', mdAuthenticate.verifyToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, doctor) => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Error finding doctor',
                errors: err
            });
        }

        if(!doctor){
            return res.status(500).json({
                success: false,
                message: 'Doctor not found',
                errors: { message : `Doctor ${id} does not exits` }
            });
        }
        
        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;

        doctor.save((err, doctorSaved) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: 'Error updating doctor',
                    errors: err
                });
            }

            res.status(200).json({
                success: true,
                doctor: doctorSaved
            });
        });
    });
});

// ==================================================
// Delte a doctor
// ==================================================
app.delete('/:id', mdAuthenticate.verifyToken, (req, res, next) => {
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctorDeleted) => {
        if(err){
            return res.status(400).json({
                success: false,
                message: 'Error deleting doctor',
                errors: err
            });
        }

        if(!doctorDeleted){
            return res.status(400).json({
                success: false,
                message: 'Doctor not found',
                errors: { message : `Doctor ${id} does not exits` }
            });
        }

        res.status(200).json({
            success: true,
            doctor: doctorDeleted
        });
    });
});

// Export
module.exports = app;