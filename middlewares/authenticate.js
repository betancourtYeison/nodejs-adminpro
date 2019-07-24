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