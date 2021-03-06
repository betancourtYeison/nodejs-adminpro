// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var mdAuthenticate = require('../middlewares/authenticate');

// Initialize variables
var app = express();

// Import model
var User = require("../models/user");

// ==========================================
//  Get User by ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;

    User.findById(id)
        .exec((err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding user',
                    errors: err
                }); 
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    message: `User with id: ${id} not found`,
                    errors: 'User not found'
                });
            }

            user.password = "=)";
            
            res.status(200).json({
                ok: true,
                user: user
            });
            
        });
});

// ==================================================
// Get all Users
// ==================================================
app.get('/', (req, res, next) => {
    var from = req.query.from || 0;
    from = Number(from);

    User.find({}, 'name email img role google')
        .skip(from)
        .limit(5)
        .exec((err, users) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Error finding user',
                    errors: err
                });
            }

            User.count({}, (err, total) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        message: 'Error counting user',
                        errors: err
                    });
                }

                res.status(200).json({
                    success: true,
                    users: users,
                    total: total
                });
            });
        })
});

// ==================================================
// Create new user
// ==================================================
app.post('/', (req, res, next) => {
    var body = req.body;
    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    user.save((err, userSaved) => {
        if(err){
            return res.status(400).json({
                success: false,
                message: 'Error creating user',
                errors: err
            });
        }

        userSaved.password = ':)';

        res.status(201).json({
            success: true,
            user: userSaved,
            userToken: req.user
        });
    });
});

// ==================================================
// Update an user
// ==================================================
app.put('/:id', [mdAuthenticate.verifyToken, mdAuthenticate.verifyAdminOrCurrentUser], (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Error finding user',
                errors: err
            });
        }

        if(!user){
            return res.status(500).json({
                success: false,
                message: 'User not found',
                errors: { message : `User ${id} does not exits` }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    message: 'Error updating user',
                    errors: err
                });
            }

            userSaved.password = ':)';

            res.status(200).json({
                success: true,
                user: userSaved
            });
        });
    });
});

// ==================================================
// Delte a user
// ==================================================
app.delete('/:id', [mdAuthenticate.verifyToken, mdAuthenticate.verifyAdmin], (req, res, next) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if(err){
            return res.status(400).json({
                success: false,
                message: 'Error deleting user',
                errors: err
            });
        }

        if(!userDeleted){
            return res.status(400).json({
                success: false,
                message: 'User not found',
                errors: { message : `User ${id} does not exits` }
            });
        }

        res.status(200).json({
            success: true,
            user: userDeleted
        });
    });
});

// Export
module.exports = app;