const express = require('express');
const app = express();


app.get('/',(req,res)=>{
    res.json({msg:'xxxx'})
})


//open server at port 3000:
app.listen(process.env.PORT || 3000, () => {
	console.log('Server is listening on port 3000');
});