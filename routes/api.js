const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//import controllers
const API = require('../controllers/API');
router.get('/api/categories', API.getAllCate);
router.get('/api/products', API.getAllProd);
router.get('/api/product/cate/:_idCategory', API.getAllProdByCate);
router.get('/api/product/id/:_id', API.getProdById);
router.get('/api/authUser/:phone',API.authUser);
router.post('/api/loginAdmin', API.loginAdmin);
router.post('/api/loginUser',API.addUser);
router.post('/api/orders',API.createOrder)
module.exports = router;