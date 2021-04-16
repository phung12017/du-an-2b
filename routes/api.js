const express = require('express');
const router = express.Router();
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
router.post('/api/updateUser/:phone',API.updateUser);
router.post('/api/order',API.createOrder);
router.get('/api/findOder/id/:_id',API.findOder);
router.post('/api/cancelOrder/id/:_id',API.cancelOrder);
router.get('/api/findOrderbyUser/id/:_uid',API.findOrderbyUser);
router.get('/api/bestSeller',API.bestSeller);
router.post('/api/cart',API.addCart);
router.post('/api/removeCart/:_uid',API.removeCart);
router.post('/api/removeProductbyCart',API.removeProductbyCart);
router.get('/api/findCart',API.findCart);
router.get('/api/banner',API.getBanner);
router.get('/api/discounts',API.getAllDiscount);
router.post('/api/exchangeVoucher',API.exchangeDiscountbyUser);
router.get('/api/findDiscountbyUser/:phone',API.getDiscountbyUser);
router.get('/api/updateToken/:phone/:fcmToken',API.updateToken)
module.exports = router;