const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({

    username:{type:String,trim:true},
    password:{type:String,trim:true},
    email:{type:String,trim:true},
    day:{type:String,trim:true}
     
});

module.exports = mongoose.model('account',accountSchema);