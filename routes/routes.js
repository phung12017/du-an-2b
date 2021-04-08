const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

///
const session = require('express-session');
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//import controllers
const CategoryController = require('../controllers/category');
const ProductController = require('../controllers/product');
const OrderController = require('../controllers/order');
const BannerController = require('../controllers/banner');
const DiscountController = require('../controllers/discount');
const UserController = require('../controllers/user');

//models
const Product = require('../models/product')
const Category = require('../models/category')
const User = require('../models/user')
const Order = require('../models/order')
const Admin = require('../models/admin')
const Banner = require('../models/banner')
const Discount = require('../models/discount')

// multer
const multer = require('multer');
const banner = require('../models/banner');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname)
	}
})
const upload = multer({
	storage: storage,
}).single('file')


//
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//cấu hình passport
router.use(
	session({
		secret: 'mysecret',
		resave: true,
		saveUninitialized: true,
		// cookie: {
		// 	maxAge: 1000 * 60 * 5,
		// },
	})
);

//2 hàm khởi tạo passport
router.use(Passport.initialize());
router.use(Passport.session());


//chứng thực thông tin đăng nhập trên mongoDB
//usernam, password là name của thẻ input trong form login
Passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		(email, password, done) => {
			Admin.findOne({ email: email, password: password }, function (err, user) {
				console.log(user);
				if (err) {
					console.log(err);
				}
				if (user) {
					//thành công sẽ trả về true với giá trị user
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		}
	)
);

//sau khi chứng thức thành công passport sẽ gọi hàm .serializeUser() vói tham số user giá trị đã lưu bên trên
//chọn thuộc tính username của user để ghi vào cookie
Passport.serializeUser((user, done) => {
	done(null, user.email);
});


Passport.deserializeUser((cookieID, done) => {
	Admin.findOne({ email: cookieID }, function (err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			return done(null, user);
		} 
	
		else {
	 
			return done(null, false);
		}
	});
});

//hàm xác thực đăng nhập
const isAuthenticated = function (request, response, next) {
	if (request.isAuthenticated()) return next();
	response.redirect('/');
};


//
router.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
})


//login
router.get('/', (req, res) => {
	res.render('./auth/login')
});
router.get('/loginError', (req, res) => {
	res.render('./auth/loginError')
});
router.post('/', Passport.authenticate('local', { successRedirect: '/main', failureRedirect: '/loginError' }));
 

//index
router.get('/main', (request, response) => {
 	if (request.isAuthenticated()) {
		response.redirect('/admin/dashboard');
	} else {
		response.redirect('/');
	}
});

//dashboard
router.get('/admin/dashboard',isAuthenticated, async (req, res) => {
	let banner = await Banner.find({});
	let categoryCount = await Category.count()
	let productCount = await Product.count()
	let userCount = await User.count()
	let orderCount = await Order.count()
	let bestSeller = await Order.aggregate([
		{ $match: { status: 2 } },
		{ $unwind: "$products" },
		{
			$group: {
				_id: "$products._idProduct",
				count: { $sum: "$products.quality" },
			}
		},
		{ $sort: { count: -1 } },
		{ $limit: 5 },
		{
			$lookup: {
				from: "products",
				localField: "_id",
				foreignField: "_id",
				as: "products"
			}
		}
	])
	let orderStatus = {
		cancel: await Order.count({ status: 3 }),
		processing: await Order.count({ status: 0 }),
		delivery: await Order.count({ status: 1 }),
		success: await Order.count({ status: 2 })
	}
	res.render('./admin/dashboard', { banner, categoryCount, productCount, userCount, orderCount, orderStatus, bestSeller })
})
router.post('/admin/dashboard', (req, res) => {
	res.redirect('/admin/dashboard')
})
//=== Category Controller ===//
//menu -> getAll
router.get('/admin/menu', isAuthenticated,CategoryController.getAllCate)

//menu -> get
router.get('/admin/menu/details/:_id',isAuthenticated, CategoryController.getMenuDetails)
//menu -> edit menu item
router.get('/admin/menu/edit/:_id', isAuthenticated,CategoryController.getCategoryById)
//menu -> create menu
router.post('/admin/menu', CategoryController.createCategory)
router.post('/admin/menu/edit/:_id', CategoryController.editCategory)
//menu -> disable menu item
router.get('/admin/menu/disable/:_id',isAuthenticated, CategoryController.disableCategory)
//menu -> enable menu item
router.get('/admin/menu/enable/:_id',isAuthenticated, CategoryController.enableCategory)
//menu -> remove menu item
router.get('/admin/menu/remove/:_id', isAuthenticated,CategoryController.removeCategory)


//=== Product Controller ===//\

//product -> getAll
router.get('/admin/products', isAuthenticated,ProductController.getAll)

//product -> add 
router.get('/admin/product/add', isAuthenticated,ProductController.add)
router.post('/admin/product/add', ProductController.createProduct)

//product -> remove
router.get('/admin/product/remove/:_id', isAuthenticated,ProductController.remove)

//product -> edit
router.get('/admin/product/edit/:_id', isAuthenticated,ProductController.edit)
router.post('/admin/product/edit/:_id', ProductController.update)


//=== API Controller ===//
router.get('/admin/api', (req, res) => {
	res.render('./admin/api')
})

//=== Order Controller ===//

//order -> getAll
router.get('/admin/orders', isAuthenticated,OrderController.getAll)

//order -> get order
router.get('/admin/order/details/:_id', isAuthenticated,OrderController.getOrderDetails)

//order -> Update
router.get('/admin/order/hoanthanh/:_id',isAuthenticated ,OrderController.done)
router.get('/admin/order/giaohang/:_id',isAuthenticated ,OrderController.update)

//=== Discount Controller ===//

//discount -> getAll
router.get('/admin/discounts',isAuthenticated, DiscountController.getAll)

//discount -> add
router.post('/admin/discounts/add', isAuthenticated,DiscountController.createDiscount)

//discount -> disable
router.get('/admin/discounts/disable/:_id', DiscountController.disable)

//discount -> enable
router.get('/admin/discounts/enable/:_id', isAuthenticated,DiscountController.enable)

//discount -> remove
router.get('/admin/discounts/remove/:_id', isAuthenticated,DiscountController.remove)

//=== Banner Controller ===//

//banner -> add
router.post('/admin/banner/add', BannerController.addBanner)

//banner -> remove
router.get('/admin/banner/remove/:_id', isAuthenticated,BannerController.removeBanner)

//banner -> enable banner 
router.get('/admin/banner/enable/:_id',isAuthenticated, BannerController.enableBanner)

//banner -> disable banner 
router.get('/admin/banner/disable/:_id', isAuthenticated,BannerController.disableBanner)

//=== User Controller ===//

//user -> getAll
router.get('/admin/users', UserController.getAll)

module.exports = router;