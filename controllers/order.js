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

exports.done = async (req,res) => {
    try{
        await Order.findOneAndUpdate({_id: req.params._id},{
            status: 2
        })
        res.redirect('/admin/orders')
    }catch(err){}
}

exports.update = async (req,res) => {
    try{
        await Order.findOneAndUpdate({_id: req.params._id},{
            status: 1
        })
        res.redirect('/admin/orders')
    }catch(err){}
}