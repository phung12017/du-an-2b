
const category = require('../models/category');

 

exports.getAllCate = async (request, response) => {
	try {
		let songs = await category.find({});
		response.send({ status: true, data: songs });
	} catch (error) {
		console.log(error);
	}
};
 
exports.loginAdmin = async (req,res)=>{
    console.log(req.body);
}