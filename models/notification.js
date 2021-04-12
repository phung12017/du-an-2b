const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title:{
        type:String,trim:true
    },
    content:{
        type:String,trim:true
    },
    isActive: {
        type: Boolean,
    },
});

module.exports = mongoose.model('notifications',notificationSchema);