// Requires
var mongoose = require('mongoose');

// Initialize Schema
var Schema = mongoose.Schema;
var hospitalSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] }, 
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

// Export model
module.exports = mongoose.model('Hospital', hospitalSchema);