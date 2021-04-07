const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = new Schema({
    _idDiscount: { 
        type: Schema.Types.ObjectId, 
        ref: 'discounts',
        require: true,
    }
});

const userSchema = new Schema({
    phone:{type:String,trim:true},
    name:{type:String,trim:true},
    address:{type:String,trim:true},
    point:{type: Number, trim: true},
    voucher:[childSchema],
});

module.exports = mongoose.model('users',userSchema);
