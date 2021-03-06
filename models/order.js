const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = new Schema({
    _idProduct: { 
        type: Schema.Types.ObjectId, 
        ref: 'products',
        require: true,
    },
    quality: {
        type: Number,
        min: [1, 'Quantity can not be less then 1.'],
        require: true,
    }
});

const orderSchema = new Schema({
    _uid: { 
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    products: [childSchema],
    delivery: { type: Number },
    createAt: { type: Date },
    updateAt: { type: Date },
    status: { type: Number },
    voucher: { type: String, ref: 'discounts', default: null},
});

module.exports = mongoose.model('orders', orderSchema);