
//import modules
// multer
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage: storage, }).single('file')

//import models
const Category = require('../models/category');
const Product = require('../models/product');


exports.getAllCate = async (request, response) => {
	try {
		let categories = await Category.find({});
		response.render('./admin/menu', { categories });
	} catch (error) {
		json({ 'err': error })
	}
};
exports.createCategory = async (req, res) => {

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			console.log('A Multer error occurred when uploading .');
		} else if (err) {
			console.log('An unknown error occurred when uploading .');
		} else {
			console.log('upload is okay');
			console.log(req.file);
			if (req.body.title) {
				const category = new Category({
					title: req.body.title,
					isActive: true,
					imageUrl: req.file.filename,
				})

				category.save(function (err) {
					if (err) {
						res.json({ kq: 0, err: err })
					} else {
						res.json({ kq: 1, category })
					}
				})
			} else {
				res.json({ kq: 0, err: 'Please fill again !' })
			}
		}
	})




};
exports.removeCategory = async (req, res) => {
	Category.findOneAndRemove({ _id: req.params._id }, function (err) {
		if (err) {
			res.json({ err: err })
		} else {
			res.redirect('/admin/menu')
		}
	})

};
exports.disableCategory = async (req, res) => {
	const _id = req.params._id

	await Category.findOneAndUpdate({ _id: _id }, { isActive: false }, function (err) {
		if (err) {
			res.json({
				err: err
			})
		} else {
			res.redirect('/admin/menu')
		}
	})
}
exports.enableCategory = async (req, res) => {
	const _id = req.params._id

	await Category.findOneAndUpdate({ _id: _id }, { isActive: true }, function (err) {
		if (err) {
			res.json({
				err: err
			})
		} else {
			res.redirect('/admin/menu')
		}
	})
}

exports.getCategoryById = async (req, res) => {
	try {
		let category = await Category.findOne({ _id: req.params._id }, { title: 1, imageUrl: 1 });
		//response.render('./admin/menu', { categories });
		res.render('./admin/menu-edit', { category })
	} catch (error) {
		json({ 'err': error })
	}

}

exports.editCategory = async (req, res) => {
	const _id = req.params._id
	console.log(_id)
	upload(req, res,  function (err) {
		if (err instanceof multer.MulterError) {
			console.log('A Multer error occurred when uploading .');
		} else if (err) {
			console.log('An unknown error occurred when uploading .');
		} else {
			 if(req.file && req.body.title){
				 Category.findOneAndUpdate({_id:_id},{title:req.body.title,imageUrl:req.file.filename},function(err){
					 if(err){
						 res.json({msg:err})
					 }else{
						 res.redirect('/admin/menu')
					 }
				 })  
			 }else{
				Category.findOneAndUpdate({_id:_id},{title:req.body.title },function(err){
					if(err){
						res.json({msg:err})
					}else{
						res.redirect('/admin/menu')
					}
				})  
			 }
		}
	})


}



exports.createProduct = async (req, res) => {

	res.render('./admin/menu-add-product', { params: req.params._id })
};


exports.createProducts = async (req, res) => {


};



