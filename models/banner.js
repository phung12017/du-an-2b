const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const childSchema = new Schema({
    imageUrl:{
        type:String,trim:true
    },
    isActive: {
        type: Boolean,
    },
});

const bannerSchema = new Schema({
    items:[childSchema],
});

module.exports = mongoose.model('banners',bannerSchema);