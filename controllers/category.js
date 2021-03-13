const category = require('../models/category');
const product = require('../models/product');

exports.getAllCate = async (request, response) => {
	try {
		let categories = await category.find({isActive:true});
		response.render('./admin/menu',{categories});
	} catch (error) {
 
	}
};

exports.createProduct = async (req, res) => {
	res.render('./admin/menu-add-product',{_idCategory:req.params._idCategory})
};


exports.createProducts = async (req, res) => {

	const _id= req.params._id
	//console.log(_id);
	const cate = await category.findOne({_id:_id})
	const prods = await product.find({_idCategory:_id})
	//console.log(result);
	console.log(prods);
	res.render('./admin/menu-product',{cate,prods})
};

 
 
 