const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    _uid:{type: Schema.Types.ObjectId},
    products:{type:Array},
    createAt:{type:Date,},
    updateAt:{type:Date},
    status:{type:String,trim:true},
});

module.exports = mongoose.model('orders',orderSchema);