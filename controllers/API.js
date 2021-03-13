
const category = require('../models/category');
const product = require('../models/product');

 

exports.getAllCate = async (request, response) => {
	try {
		let categories = await category.find({isActive:true});
		response.send({categories});
	} catch (error) {
 
	}
};


exports.getAllProd = async (request, response) => {
	try {
		let products = await product.find({isActive:true});
		response.send({products});
	} catch (error) {
 
	}
};
 
exports.getAllProdByCate = async (request, response) => {
	const _idCategory = request.params._idCategory
	try {
		let products = await product.find({isActive:true,_idCategory:_idCategory});
		response.send({products});
	} catch (error) {
 
	}
};
 
exports.getProdById = async (request, response) => {
	const _id = request.params._id
	try {
		let prod = await product.findOne({isActive:true,_id:_id});
		response.send(prod);
	} catch (error) {
		response.send({msg:error});
	}
};
 
exports.loginAdmin = async (req,res)=>{
    console.log(req.body);
}