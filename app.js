//import modules
const express = require('express');
const app = express();
const routes  = require('./routes/routes');
const api  = require('./routes/api');
const PORT = process.env.PORT || 3000;

//app use
app.use(routes)
app.use(api)

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/uploads', express.static(__dirname + '/Images'));
// public static folder
app.use(express.static('public'));

//connectDB
const connectDB = require("./config/mongoose");
connectDB();

//open server at port 3000:
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});