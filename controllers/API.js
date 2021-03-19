const { reset } = require('nodemon');
const moment = require('moment');
const category = require('../models/category');
const Product = require('../models/product');
const user = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');
const { use } = require('../routes/api');
const e = require('express');

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
		address: req.body.address
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
}

exports.createOrder = async (req, res) => {
	if (!req.body._uid
		|| !req.body.products) {
		res.send({ msg: 'Vui lòng không để trống.' })
	} else {
		try {
			if (!(Array.isArray(req.body.products) && req.body.products.length)) {
				res.send({ msg: 'Vui lòng nhập mảng.' })
			}else {
				const items = {
					_uid: req.body._uid,
					status: 0,
					createAt: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
					updateAt: null,
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
}

exports.findOder = async (req, res) => {
	const { _uid } = req.query
	if (!_uid) {
		res.send({ msg: 'Vui lòng không để trống.' })
	} else {
		await Order.findOne({ '_uid': _uid }).populate('_uid').populate('products._idProduct').exec(function (err, data) {
			if (err) {
				res.send({
					message: err
				})
				res.end()
			} else {
				res.json({
					Order: data
				})
				res.end()
			}
		})
	}
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

exports.updateCart = function (req, res) {
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
				} else {
					const indexFound = cart.products.findIndex(item => {
						return item._idProduct == _idProduct;
					});
					if (indexFound !== -1) {
						let updatedQty = cart.products[indexFound].quality - quality;
						if (updatedQty <= 0) {
							cart.products.splice(indexFound, 1);
						} else {
							cart.products[indexFound].quality = updatedQty;
						}
						return cart.save();
					} else {
						throw new Error('Invalid request');
					}
				}
			})
			.then(updatedCart => res.json(updatedCart))
			.catch(err => {
				console.log(err)
			});
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
}

exports.loginAdmin = async (req, res) => {
	console.log(req.body);
}
