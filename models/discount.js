const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema({
    title:{
        type:String,trim:true
    },
    code:{
        type:String,trim:true
    },
    cost:{
        type:Number,trim:true
    },
    percent:{
        type:Number,trim:true
    },
    dateStart:{
        type:Date
    },
    dateEnd:{
        type:Date
    },
    isActive: {
        type: Boolean,
    },
});

module.exports = mongoose.model('discounts',discountSchema);