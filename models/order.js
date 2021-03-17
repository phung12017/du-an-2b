const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = new Schema({
    _idProduct: { type: Schema.Types.ObjectId, ref: 'products' }
});

const orderSchema = new Schema({
    _uid: { type: Schema.Types.ObjectId },
    products: [childSchema],
    createAt: { type: Date },
    status: { type: Number },
});

module.exports = mongoose.model('orders', orderSchema);