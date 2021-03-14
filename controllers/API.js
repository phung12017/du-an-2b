
const { request, response } = require('express');
const category = require('../models/category');
const product = require('../models/product');
const user = require('../models/user');

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

exports.createProd = async (request, response) => {
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

exports.addUser = async (req, res) => {
	let newUser = new user({
		phone: '+84'+req.body.phone,
		name: req.body.name,
		address: req.body.address})
	if((req.body.phone 
		&& req.body.name
		&& req.body.address) == ''){
			res.send({msg: 'Vui lòng không để trống'})
		}else{
			try{
				await user.find({phone: req.body.phone},function(err,data){
					if(err) res.send({msg:err})
					if(data == ''){
						newUser.save(function(err,User){
							if(err){res.send({msg: err})
							}else{
								res.send({User})
							} 
						})
					}else{
						res.send({msg: 'Tài khoản đã tồn tại',data})
					}
				})
			}catch(error){
				res.send({msg:error});
			}
		}
}


exports.loginAdmin = async (req,res)=>{
    console.log(req.body);
}