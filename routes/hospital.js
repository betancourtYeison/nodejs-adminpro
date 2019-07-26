// Requires
var express = require('express');
var mdAuthenticate = require('../middlewares/authenticate');

// Initialize variables
var app = express();

// Import model
var Hospital = require("../models/hospital");

// ==========================================
//  Get Hospital by ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Hospital.findById(id)
        .populate('user', 'name email role google')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding hospital',
                    errors: err
                }); 
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: `Hospital with id: ${id} not found`,
                    errors: 'Hospital not found'
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospital
            });
            
        });
});         

// ==================================================
// Get all Hospitals
// ==================================================
app.get('/', (req, res, next) => {
    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec((err, hospitals) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Error finding hospital',
                    errors: err
                });
            }

            Hospital.count({}, (err, total) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: 'Error counting hospital',
                        errors: err
                    });
                }

                res.status(200).json({
                    success: true,
                    hospitals: hospitals,
                    total: total
                });
            }); 
        })
});

// ==================================================
// Create new hospital
// ==================================================
app.post('/', mdAuthenticate.verifyToken, (req, res, next) => {
    var body = req.body;
    var hospital = new Hospital({
        name: body.name,
        user: req.user._id,
    });

    hospital.save((err, hospitalSaved) => {
        if(err){
            return res.status(400).json({
                success: false,
                message: 'Error creating hospital',
                errors: err
            });
        }

        res.status(201).json({
            success: true,
            hospital: hospitalSaved
        });
    });
});

// ==================================================
// Update an hospital
// ==================================================
app.put('/:id', mdAuthenticate.verifyToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Error finding hospital',
                errors: err
            });
        }

        if(!hospital){
            return res.status(500).json({
                success: false,
                message: 'Hospital not found',
                errors: { message : `Hospital ${id} does not exits` }
            });
        }
        
        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, hospitalSaved) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: 'Error updating hospital',
                    errors: err
                });
            }

            res.status(200).json({
                success: true,
                hospital: hospitalSaved
            });
        });
    });
});

// ==================================================
// Delte a hospital
// ==================================================
app.delete('/:id', mdAuthenticate.verifyToken, (req, res, next) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {
        if(err){
            return res.status(400).json({
                success: false,
                message: 'Error deleting hospital',
                errors: err
            });
        }

        if(!hospitalDeleted){
            return res.status(400).json({
                success: false,
                message: 'Hospital not found',
                errors: { message : `Hospital ${id} does not exits` }
            });
        }

        res.status(200).json({
            success: true,
            hospital: hospitalDeleted
        });
    });
});

// Export
module.exports = app;