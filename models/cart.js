const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema({
    _idProduct: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quality: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    }
});
const cartSchema = new Schema({
    _uid: { type: Schema.Types.ObjectId },
    products: [ItemSchema],
});

module.exports = mongoose.model('carts', cartSchema);