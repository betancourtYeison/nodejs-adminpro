// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var mdAuthenticate = require('../middlewares/authenticate');

// Initialize variables
var app = express();

// Import model
var User = require("../models/user");

// Google
const {OAuth2Client} = require('google-auth-library');
var CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);


// ==================================================
// Renew Token
// ==================================================
app.get('/renewToken', mdAuthenticate.verifyToken, async (req, res, next) => {

    var token = jwt.sign({ user: req.user }, SEED, { expiresIn: 14400 });

    res.status(200).json({
        success: true,
        token: token
    });
});

// ==================================================
// Login with Google
// ==================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res, next) => {
    var token = req.body.token;
    var googleUser = await verify(token).catch(e => {
        return res.status(404).json({
            success: false,
            message: 'Token not valid',
        });
    })

    User.findOne({ email: googleUser.email }, (err, user) => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Error finding user',
                errors: err
            });
        }

        if(user){
            if(!user.google){
                return res.status(400).json({
                    success: false,
                    message: 'You should sign in by normal authentication',
                });
            }else{
                // Create token
                user.password = ':)';
                var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    success: true,
                    user: user,
                    token: token,
                    id: user.id,
                    menu: getMenu(user.role)
                });
            }
        }else{
            var userToRegister = new User();
            userToRegister.name = googleUser.name;
            userToRegister.email = googleUser.email;
            userToRegister.img = googleUser.img;
            userToRegister.google = true;
            userToRegister.password = ":)";
            userToRegister.save((err, userSaved) => {
                var token = jwt.sign({ user: userSaved }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    success: true,
                    user: userSaved,
                    token: token,
                    id: userSaved.id,
                    menu: getMenu(userSaved.role)
                });
            });
        }
    });
});

// ==================================================
// Login
// ==================================================
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
                message: 'Incorrect credentials',
            });
        }

        if(!bcrypt.compareSync(body.password, user.password)){
            return res.status(400).json({
                success: false,
                message: 'Incorrect credentials',
            });
        }

        // Create token
        user.password = ':)';

        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            success: true,
            user: user,
            token: token,
            id: user.id,
            menu: getMenu(user.role)
        });
    });
});

function getMenu(ROLE){
    menu = [
        {
            title: "Principal",
            icon: "mdi mdi-gauge",
            submenu: [
                { title: "Dashboard", url: "/dashboard" },
                { title: "ProgressBar", url: "/progress" },
                { title: "Graphics", url: "/graphics1" },
                { title: "Promises", url: "/promises" },
                { title: "Rxjs", url: "/rxjs" }
            ]
        },
        {
            title: "Maintenance",
            icon: "mdi mdi-folder-lock-open",
            submenu: [
                { title: "Hospitals", url: "/hospitals/all" },
                { title: "Doctos", url: "/doctors" }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE'){
        menu[1].submenu.unshift({ title: "Users", url: "/users/all" });
    }

    return menu;
}

// Export
module.exports = app;