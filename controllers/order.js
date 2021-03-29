const Order = require('../models/order');
const moment = require('moment');
exports.getAll = async (req, res) => {
    await Order.find().populate('_uid').populate('products._idProduct').exec(function (err, data) {
        if (err) {
            res.send({
                message: err
            })
            res.end()
        } else {
            res.locals.moment = moment
            res.render('./order/list', {Order:data})
            res.end();
        }
    })
}

exports.getOrderDetails = async (req,res) => {
    try {
		await Order.find({_id: req.params._id}).populate('_uid').populate('products._idProduct').exec(function (err, data) {
			if (err) {
				res.send(err);
				res.end();
			}else{
                res.locals.moment = moment
                res.render('./order/detail',{Order:data})
				res.end();
			}
		})
	} catch (error) {
		res.json({ 'err': error })
	}
}

exports.edit = async (req,res) => {
    await Order.findOne({_id: req.params._id},function(err,data){
		if(err){
			res.json(err)
			res.end()
		}else{
            res.render('./order/list', {Order: data });
			res.end()
		}
	})
}

exports.update = async (req,res) => {
    try{
        await Order.findOneAndUpdate({_id: req.params._id},{
            status: req.body.status
        })
        res.redirect('/admin/orders')
    }catch(err){}
}