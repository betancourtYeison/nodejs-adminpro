// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Initialize variables
var app = express();

// Import models
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// default options
app.use(fileUpload());

// ==================================================
// Function to upload file
// ==================================================
app.put('/:type/:id', (req, res, next) => {
    var type = req.params.type;
    var id = req.params.id;

    var validModels = ['hospitals', 'doctors', 'users'];

    if(validModels.indexOf(type) < 0){
        return res.status(400).json({
            success: false,
            message: 'Type not valid',
            errors: { message: 'Valid types: ' + validModels.join(', ') }
        });
    }

    if(!req.files){
        return res.status(400).json({
            success: false,
            message: 'File not uploaded',
            errors: { message: 'You should select an image' }
        });
    }

    var file = req.files.img;
    var fileType = file.name.split('.');
    var fileExtension = fileType[fileType.length - 1];

    var validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if(validExtensions.indexOf(fileExtension) < 0){
        return res.status(400).json({
            success: false,
            message: 'Extension not valid',
            errors: { message: 'Valid extensions: ' + validExtensions.join(', ') }
        });
    }

    var fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

    var path = `./uploads/${type}/${fileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, function(err) {
        if (err){
            return res.status(500).json({
                success: false,
                message: 'Error moving file',
                errors: err
            });
        }
        uploadByType(type, id, fileName, path, res);
    });
});

function uploadByType(type, id, fileName, path, res){
    if(type === 'hospitals'){
        Hospital.findById(id, (err, hospital) => {
            saveFile(hospital, type, id, fileName, path, res);
        });
    }

    if(type === 'doctors'){
        Doctor.findById(id, (err, doctor) => {
            saveFile(doctor, type, id, fileName, path, res);
        });
    }

    if(type === 'users'){
        User.findById(id, (err, user) => {
            saveFile(user, type, id, fileName, path, res);
        });
    }
};

function saveFile(model, type, id, fileName, path, res){
    if(!model){
        return removeFile(path, `${id} not found in ${type}`, res);
    }

    var updateType = (model, res) => {
        model.img = fileName;
        model.save((err, modelUpdated) => {
            if (err){
                return removeFile(path, `Error updating img in ${type}`, res);
            }
            if(type === 'users'){
                modelUpdated.password = '=)';
            }
            return res.status(200).json({
                success: true,
                message: `Img in ${type} updated`,
                [type]: modelUpdated
            });
        });
    };

    var lastPath = `./uploads/${type}/${model.img}`;

    if(model.img && model.img.length > 0 && fs.existsSync(lastPath)){
        fs.unlink(lastPath, err => {
            if (err){
                return removeFile(path, err, res);
            }
            updateType(model, res);
        });
    }else{
        updateType(model, res);
    }
};

function removeFile(path, message, res){
    if(fs.existsSync(path)){
        fs.unlink(path, err => {
            if (err){
                res.status(500).json({
                    success: false,
                    message: 'Error removing img in server',
                    errors: err
                });
            }else{
                res.status(500).json({
                    success: false,
                    message: message,
                    errors: { message : `File could not be saved` }
                });
            }
        });
    }else{
        res.status(500).json({
            success: false,
            message: message,
            errors: { message : `File could not be saved` }
        });
    }
};

// Export
module.exports = app;