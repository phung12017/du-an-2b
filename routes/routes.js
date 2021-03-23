const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//import controllers
const CategoryController = require('../controllers/category');
const ProductController = require('../controllers/product');
const OrderController = require('../controllers/order');
const BannerController = require('../controllers/banner');

//models
const Product = require('../models/product')
const Category = require('../models/category')
const User = require('../models/user')
const Order = require('../models/order')
const Banner = require('../models/banner')

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
const upload = multer({storage: storage,
}).single('file')



router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//login
router.get('/', (req, res) => {
	res.render('./auth/login')
});

 

//dashboard
router.get('/admin/dashboard',async (req,res)=>{
	let banner = await Banner.find({});
	let categoryCount = await Category.count()
	let productCount = await Product.count()
	let userCount = await User.count()
	let orderCount = await Order.count()
	let bestSeller = await Product.find({_idCategory:'605432bed8b32e0fe4770cc7'})
	let orderStatus = {
		cancel: await Order.count({status:3}),
		processing:await Order.count({status:0}),
		delivery:await Order.count({status:1}),
		success:await Order.count({status:2})
	}
	res.render('./admin/dashboard',{banner,categoryCount,productCount,userCount,orderCount,orderStatus,bestSeller})
})
router.post('/admin/dashboard', (req, res) => {
	res.redirect('/admin/dashboard')
})
 //=== Category Controller ===//
//menu -> getAll
router.get('/admin/menu', CategoryController.getAllCate)

//menu -> get
router.get('/admin/menu/details/:_id', CategoryController.getMenuDetails)
//menu -> edit menu item
router.get('/admin/menu/edit/:_id', CategoryController.getCategoryById)
//menu -> create menu
router.post('/admin/menu', CategoryController.createCategory)
router.post('/admin/menu/edit/:_id', CategoryController.editCategory)
//menu -> disable menu item
router.get('/admin/menu/disable/:_id', CategoryController.disableCategory)
//menu -> enable menu item
router.get('/admin/menu/enable/:_id', CategoryController.enableCategory)
//menu -> remove menu item
router.get('/admin/menu/remove/:_id', CategoryController.removeCategory)


//=== Product Controller ===//\

//product -> getAll
router.get('/admin/products',ProductController.getAll)

//product -> add 
router.get('/admin/product/add',ProductController.add)
router.post('/admin/product/add',ProductController.createProduct)

//product -> remove
router.get('/admin/product/remove/:_id',ProductController.remove)

//product -> edit
router.get('/admin/product/edit/:_id',ProductController.edit)
router.post('/admin/product/edit/:_id',ProductController.update)


//=== API Controller ===//
router.get('/admin/api', (req, res) => {
	res.render('./admin/api')
})

//=== Order Controller ===//

//order -> getAll
router.get('/admin/orders',OrderController.getAll)

//=== Banner Controller ===//

//banner -> add
router.post('/admin/banner/add',BannerController.addBanner)

//banner -> remove
router.get('/admin/banner/remove/:_id',BannerController.removeBanner)

//banner -> enable banner 
router.get('/admin/banner/enable/:_id', BannerController.enableBanner)

//banner -> disable banner 
router.get('/admin/banner/disable/:_id', BannerController.disableBanner)


module.exports = router;