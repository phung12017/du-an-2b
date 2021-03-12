const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title:{type:String,trim:true},
    isActive:{type:Boolean},
    imageUrl:{type:String,trim:true},
});

module.exports = mongoose.model('categorys',categorySchema);