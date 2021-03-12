const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//import controllers
const API = require('../controllers/API');

router.get('/api/categories', API.getAllCate);

module.exports = router;