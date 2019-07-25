// Requires
var mongoose = require('mongoose');

// Initialize Schema
var Schema = mongoose.Schema;
var doctorSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] }, 
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'Hospital id is required'] }
});

// Export model
module.exports = mongoose.model('Doctor', doctorSchema);