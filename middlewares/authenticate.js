// Requires
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==================================================
// Verify token
// ==================================================
exports.verifyToken = function(req, res, next){
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                success: false,
                message: 'Token not valid',
                errors: err
            });
        }

        req.user = decoded.user

        next();
    });
};

// ==================================================
// Verify ADMIN
// ==================================================
exports.verifyAdmin = function(req, res, next){

    var user = req.user

    if(user.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            success: false,
            message: 'Not allow to role: USER_ROLE',
            errors: { messages: 'Not allow to role: USER_ROLE' }
        });
    }

    next();
};

// ==================================================
// Verify ADMIN OR CURRENT USER
// ==================================================
exports.verifyAdminOrCurrentUser = function(req, res, next){

    var user = req.user
    var id = req.params.id;
    
    if(user.role !== 'ADMIN_ROLE' && user._id !== id){
        return res.status(401).json({
            success: false,
            message: 'Not allow to role: USER_ROLE',
            errors: { messages: 'Not allow to role: USER_ROLE' }
        });
    }

    next();
};