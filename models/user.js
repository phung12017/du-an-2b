const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone:{type:String,trim:true},
    name:{type:String,trim:true},
    address:{type:String,trim:true},
    point:{type: Number, trim: true},
});

module.exports = mongoose.model('users',userSchema);
