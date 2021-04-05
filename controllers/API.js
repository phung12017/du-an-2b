const moment = require('moment');
const category = require('../models/category');
const Product = require('../models/product');
const user = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Banner = require('../models/banner');
const Discount = require('../models/discount');

exports.getAllCate = async (request, response) => {
	try {
		let categories = await category.find({ isActive: true });
		response.send({ categories });
	} catch (error) {
	}
};

exports.getAllProd = async (request, response) => {
	try {
		let products = await Product.find({ isActive: true });
		response.send({ products });
	} catch (error) {
	}
};

exports.createProd = async (request, response) => {
	try {
		let products = await Product.find({ isActive: true });
		response.send({ products });
	} catch (error) {
	}
};

exports.getAllProdByCate = async (request, response) => {
	const _idCategory = request.params._idCategory
	try {
		let products = await Product.find({ isActive: true, _idCategory: _idCategory });
		response.send({ products });
	} catch (error) {

	}
};

exports.getProdById = async (request, response) => {
	const _id = request.params._id
	try {
		let prod = await Product.findOne({ isActive: true, _id: _id });
		response.send(prod);
	} catch (error) {
		response.send({ msg: error });
	}
};

exports.addUser = async (req, res) => {
	let phone = '+84' + req.body.phone;
	let newUser = new user({
		phone: phone,
		name: req.body.name,
		address: req.body.address,
		point: 0,
	})
	if ((req.body.phone
		&& req.body.name
		&& req.body.address) == '') {
		res.send({ msg: 'Vui lòng không để trống' })
	} else {
		try {
			await user.find({ phone: phone }, function (err, data) {
				if (err) res.send({ msg: err })
				if (data == '') {
					newUser.save(function (err, User) {
						if (err) {
							res.send({ msg: err })
						} else {
							res.send({ User })
						}
					})
				} else {
					res.send({ msg: 'Tài khoản đã tồn tại', data })
				}
			})
		} catch (err) {
			console.log(err)
		}
	}
};

exports.updateUser = async (req,res) => {
	let phone = '+84' + req.params.phone;
	if(!phone || !req.body.name || !req.body.address){
		res.send({msg: "Vui lòng không bỏ trống"})
	}else{
		try{
			await user.findOneAndUpdate({ phone }, {
				name: req.body.name,
				address: req.body.address,
			},function(err,data){
				if ((err)) {
					res.send({msg: err});
					res.end();
				}else{
					res.send({msg: `Update user: ${phone}`})
					res.end();
				}
			})
		}catch(err){
			res.send({ msg: err });
		}
	}
}

exports.authUser = async (req, res) => {
	let phone = '+84' + req.params.phone;
	try {
		await user.findOne({ phone }, function (err, User) {
			if (err) {
				res.send({ msg: err })
			} else {
				res.send(User)
			}
		})
	} catch (err) {
		res.send({ msg: err });
	}
};

exports.createOrder = async (req, res) => {
	if (!req.body._uid
		|| !req.body.products
		|| !req.body.delivery) {
		res.send({ msg: 'Vui lòng không để trống.' })
	} else {
		try {
			if (!(Array.isArray(req.body.products) && req.body.products.length)) {
				res.send({ msg: 'Vui lòng nhập mảng.' })
			} else {
				const items = {
					_uid: req.body._uid,
					status: 0,
					createAt: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
					updateAt: null,
					delivery: req.body.delivery,
				}
				items.products = req.body.products.map(item => {
					return {
						_idProduct: item._idProduct,
						quality: item.quality,
					};
				});
				const order = new Order(items);
				order.save().then(res.json({ items }));
				res.end();
			}
		} catch (err) { }
	}
};

exports.findOder = async (req, res) => {
	const { _id } = req.params
	if (!_id) {
		res.send({ msg: 'Vui lòng không để trống.' })
	} else {
		await Order.find({_id}).populate('_uid').populate('products._idProduct').exec(function (err, data) {
			if (err) {
				res.send(err);
				res.end();
			}else{
				res.send({Order: data})
				res.end();
			}
		})
	}
};

exports.findOrderbyUser = async (req, res) => {
	const { _uid } = req.params
	await Order.find({_uid},function(err,data){
		if (err) {
			console.log(err);
			res.end();
		}else{
			res.send({Order: data})
			res.end();
		}
	})
}

exports.addCart = function (req, res) {
	const { _uid, _idProduct } = req.body;
	const quality = Number.parseInt(req.body.quality);
	if (!req.body._uid
		|| !req.body.quality
		|| !req.body._idProduct) {
		res.send({ msg: 'Vui lòng không để trống.' })
	} else {
		Cart.findOne({ _uid: _uid })
			.exec()
			.then(cart => {
				if (!cart && quality <= 0) {
					throw new Error('Invalid request');
				} else if (cart) {
					const indexFound = cart.products.findIndex(item => {
						return item._idProduct == _idProduct;
					});
					if (indexFound !== -1 && quality <= 0) {
						cart.products.splice(indexFound, 1);
					} else if (indexFound !== -1) {
						cart.products[indexFound].quality = cart.products[indexFound].quality + quality;
					} else if (quality > 0) {
						cart.products.push({
							_idProduct: _idProduct,
							quality: quality
						});
					} else {
						throw new Error('Invalid request');
					}
					return cart.save();
				} else {
					const cartData = {
						_uid: _uid,
						products: [
							{
								_idProduct: _idProduct,
								quality: quality
							}
						]
					};
					cart = new Cart(cartData);
					return cart.save();
				}
			})
			.then(savedCart => res.json(savedCart))
			.catch(err => {
				console.log(err)
			});
	}
};

exports.removeCart = function (req, res) {
	const _uid = req.params._uid
	if (!_uid) {
		res.send({ msg: 'Vui lòng không để trống.' })
	} else {
		Cart.findOneAndRemove({ _uid: _uid }, { "products": [] }, function (err) {
			if (err) {
				res.send({ msg: 'Không còn gì để xóa'})
				res.end()
			} else{
				res.send({ msg: 'Đã xóa tất cả sản phẩm' })
				res.end()
			}		
		})
	}
};

exports.removeProductbyCart = function (req, res) {
	const {_uid,_idProduct} = req.body;
	if( !_uid || !_idProduct){
		res.send({msg: 'Kh bỏ trống'})
	}else{
		Cart.update({_uid},{$pull: {"products": {_idProduct} }},function(err){
			if(err){
				console.log(err)
			}
			res.end();
		})
	}
};

exports.findCart = async (req, res) => {
	const { _uid } = req.query;
	if (!_uid) {
		res.send({ msg: 'Vui lòng không để trống.' })
	} else {
		await Cart.findOne({ '_uid': _uid }).populate('products._idProduct').exec(function (err, data) {
			if (err) {
				res.send({
					message: err
				})
				res.end()
			} else {
				res.json({
					cart: data
				})
				res.end()
			}
		})
	}
};

exports.getBanner = async (req, res) => {
	await Banner.findOne({_id:"60598839cacc200004977bca"}, function (err, data) {
		if (err) {
			res.send(err)
			res.end()
		} else {
			var abc = data.items.filter(function(e){
				return (e.isActive == true)
			})
			res.send(abc)
			res.end()
		}
	})
};

exports.loginAdmin = async (req, res) => {
	console.log(req.body);
};

exports.bestSeller = async (req, res) => {
	await Order.aggregate([
		{ $match: {status: 2 }},
		{ $unwind: "$products" },
		{ $group: { 
			_id: "$products._idProduct", 
			count: { $sum: "$products.quality" },
		}},
		{ $sort: {count: -1}},
		{ $limit : 5 },
		{ $lookup: {
			from: "products",
			localField: "_id", // find từ local trong function
			foreignField: "_id", // find trên collection mongoDB
			as: "products"
		}},
	],function(err,data){
		if(err){
			res.send(err);
			res.end();
		}else{
			res.send(data);
			res.end();
		}
	})
};

exports.cancelOrder = async (req, res) => {
	let _id = req.params._id;
	try{
        await Order.findOneAndUpdate({_id},{
            status: 3
        },function(err){
			if(err){
				res.send(err)
				res.end()
			}else{
				res.send({msg: `Hủy đơn hàng thành công: ${_id}`})
				res.end();
			}
		});
    }catch(err){
		res.send(err);
		res.end();
	}
};

exports.getAllDiscount = async (req, res) => {
	try{
		await Discount.find({isActive: true},function(err,data){
			if(err){
				res.send(err);
				res.end();
			}else{
				res.send({Discount: data})
				res.end();
			}
		})
	}catch(err){}
};
