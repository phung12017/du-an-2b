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

module.exports = router;