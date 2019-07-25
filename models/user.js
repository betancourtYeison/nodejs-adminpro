// Requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Roles
var roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a role allowed'
}

// Initialize Schema
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, unique: true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles },
    google: { type: Boolean, default: false }
})

userSchema.plugin(uniqueValidator, { message: '{PATH} has to be unique'})

// Export model
module.exports = mongoose.model('User', userSchema);