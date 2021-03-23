
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
const Banner = require('../models/banner');

exports.addBanner = async (req, res) => {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			console.log('A Multer error occurred when uploading .');
		} else if (err) {
			console.log('An unknown error occurred when uploading .');
		} else {
			console.log('upload is okay');
			if (req.body) {
				Banner.findOne({})
					.exec()
					.then(banner => {
						const imageUrl = req.file.filename;
						if (!banner <= 0) {
							const indexFound = banner.items.findIndex(item => {
								return item.imageUrl == imageUrl;
							});
							if (indexFound !== 1) {
								banner.items.push({
									imageUrl: req.file.filename,
									isActive: true
								});
							} else {
								throw new Error('Invalid request');
							}
							return banner.save();
						} else if (banner) {
							
						}else{
							const bannerData = {
							items: [
								{
									imageUrl: req.file.filename,
									isActive: true
								}
							]
						};
						banner = new Banner(bannerData);
						return banner.save();
						}
					})
					.then(savedBanner => res.redirect('/admin/dashboard'))
					.catch(err => {
						console.log(err)
					});
			} else {
				res.json({ kq: 0, err: 'Please fill again !' })
			}
		}
	})
};

exports.removeBanner = async (req, res) => {
	const _id = req.params._id;
	if( !_id ){
		res.send({msg: 'Kh bỏ trống'})
	}else{
		await Banner.updateOne({_id: '60598839cacc200004977bca'},{$pull: {"items": {_id} }},function(err){
			if(err){
				console.log(err)
			}
			res.redirect('/admin/dashboard')
			res.end();
		})
	}
};

exports.disableBanner = async (req, res) => {
	const _id = req.params._id
	await Banner.findOneAndUpdate({"items._id": _id},{$set: { "items.$.isActive": false }},function(err){
		if(err){
			res.json(err)
			res.end()
		}else{
			res.redirect('/admin/dashboard')
			res.end()
		}
	})
}

exports.enableBanner = async (req, res) => {
	const _id = req.params._id;
	await Banner.findOneAndUpdate({"items._id": _id},{$set: { "items.$.isActive": true }},function(err){
		if(err){
			res.json(err)
			res.end()
		}else{
			res.redirect('/admin/dashboard')
			res.end()
		}
	})
}




