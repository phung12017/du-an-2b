const Discount = require('../models/discount');
const moment = require('moment');
exports.getAll = async (req, res) => {
    await Discount.find({},function(err,data){
        if(err){
            res.send(err);
            res.end();
        }else{
            res.locals.moment = moment;
            res.render('./discount/list',{discounts: data});
            res.end();
        }
    })
}

exports.createDiscount = async (req, res) => {
    if (req.body) {
        const discount = new Discount({
            title: req.body.title,
            code: req.body.code.toUpperCase(),
            isActive: true,
            percent: req.body.percent,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
        })
        await discount.save(function (err) {
            if (err) {
                res.json({ kq: 0, err: err })
            } else {
                res.redirect('/admin/discounts')
            }
        })
    }
}

exports.disable = async (req, res) => {
    let _id = req.params._id;
    try{
        await Discount.findOneAndUpdate({_id},{isActive: false},function(err){
            if (err) {
                res.send(err)
                res.end();
            }
            res.redirect('/admin/discounts');
            res.end();
        })
    }catch(err){}
}

exports.enable = async (req, res) => {
    let _id = req.params._id;
    try{
        await Discount.findOneAndUpdate({_id},{isActive: true},function(err){
            if (err) {
                res.send(err)
                res.end();
            }
            res.redirect('/admin/discounts');
            res.end();
        })
    }catch(err){}
}

exports.remove = async (req, res) => {
    let _id = req.params._id;
    try{
        await Discount.findOneAndRemove({_id},function(err){
            if(err){
                res.send(err);
                res.end();
            }
            res.redirect('/admin/discounts');
            res.end();
        })
    }catch(err){}
}