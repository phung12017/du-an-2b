const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
const conn = await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});
console.log(`MongoDB Connected: ${conn.connection.host}`); 
};
module.exports = connectDB;
