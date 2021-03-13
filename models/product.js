const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{type:String,trim:true},
    price:{type:Number,trim:true},
    description:{type:String,trim:true},
    _idCategory:{type:String},
    imageUrl:{type:String,trim:true},
    createAt:{type:Date,},
    isActive:{type:Boolean},
    size:{type:Object},
    topping:{type:Array}
});

module.exports = mongoose.model('products',productSchema);