const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    name: { type: String, trim: true },
    image: { type: String, trim: true },
 
});

module.exports = mongoose.model('admin', adminSchema);
