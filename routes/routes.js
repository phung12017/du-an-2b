const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//import controllers
const CategoryController = require('../controllers/category');
const ProductController = require('../controllers/product');

//models
const product = require('../models/product')

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
const uploads = multer({
	storage: storage
})



router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//login
router.get('/', (req, res) => {
	res.render('./auth/login')
});

//import models

router.get('/admin/dashboard', (req, res) => {
	res.render('./admin/dashboard')
})

router.post('/admin/dashboard', (req, res) => {
	res.render('./admin/dashboard')
})


//menu 
router.get('/admin/menu', CategoryController.getAllCate)

//menu/:_id/add-product
router.get('/admin/menu/:_id/add-product', CategoryController.createProduct)
router.post('/api/createProduct', uploads.single('file'), (req, res) => {
	const small = { small: null }
	const med = { medium: null }
	const lar = { larger: null }
	const sizes = { ...small, ...lar, ...med }
	const toppings = []

	// const product  = {
	// 	title: req.body.title,
	// 	price: req.body.price,
	// 	description: req.body.description,
	// 	_idCategory: req.body.categoryId,
	// 	imageUrl: req.file.filename,
	// 	size: sizes,
	// 	topping:toppings,
	// 	createAt: new Date(),
	// 	isActive: true,
	// }


	try {
		let newProd = new product({
			title: req.body.title,
			price: req.body.price,
			description: req.body.description,
			_idCategory: req.body.categoryId,
			imageUrl: req.file.filename,
			size: sizes,
			topping: toppings,
			createAt: new Date(),
			isActive: true,
		})

		newProd.save()

		res.json(newProd)


	} catch (error) {
		res.json({ err: error.message })
	}
})

//menu/product/:_idCategory
router.get('/admin/menu/product/:_id', CategoryController.createProducts)

router.get('/admin/api', (req, res) => {
	res.render('./admin/api')
})

module.exports = router;