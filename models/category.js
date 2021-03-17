const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({

    title:{type:String,trim:true},
    isActive:{type:Boolean},
    imageUrl:{type:String,trim:true},
    products:[{type:mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('categorys',categorySchema);