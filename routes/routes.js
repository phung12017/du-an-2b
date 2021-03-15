const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//import controllers
const CategoryController = require('../controllers/category');
const ProductController = require('../controllers/product');

//models
const Product = require('../models/product')
const category = require('../models/category')
const x = require('../models/x')
// multer
const multer = require('multer');
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
router.get('/admin/dashboard', (req, res) => {
	res.render('./admin/dashboard')
})
router.post('/admin/dashboard', (req, res) => {
	res.render('./admin/dashboard')
})
 //=== Category Controller ===//
//menu 
router.get('/admin/menu', CategoryController.getAllCate)
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

 
//=== Product Controller ===//
//product -> getByCategory
router.get('/admin/menu/products/:_id',ProductController.getByCate)

//product -> createProduct
router.get('/admin/menu/addProductTo/:_id',ProductController.getCateById)
router.post('/admin/menu/addProductTo/:_id', ProductController.createProduct)
 
 


//=== API Controller ===//
router.get('/admin/api', (req, res) => {
	res.render('./admin/api')
})

module.exports = router;