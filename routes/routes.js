const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


//login
router.get('/', (req, res) => {
	res.render('./auth/login')
});

module.exports = router;