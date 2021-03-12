const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{type:String,unique:true,required:true,trim:true},
    password:{type:String,required:true,trim:true},
    displayName:{type:String,required:true,trim:true},
    name:{type:String,trim:true},
    phone:{type:Number,trim:true},
    address:{type:String,trim:true},
});

module.exports = mongoose.model('users',userSchema);
