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


 
 
 