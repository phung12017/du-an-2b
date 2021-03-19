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
