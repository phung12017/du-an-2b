const Order = require('../models/order');
const User = require('../models/user');
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
            res.render('./order/list', { Order: data })
            res.end();
        }
    })
}

exports.getOrderDetails = async (req, res) => {
    try {
        await Order.find({ _id: req.params._id }).populate('_uid').populate('products._idProduct').populate('voucher').exec(function (err, data) {
            if (err) {
                res.send(err);
                res.end();
            } else {
                res.locals.moment = moment
                res.render('./order/detail', { Order: data })
                res.end();
            }
        })
    } catch (error) {
        res.json({ 'err': error })
    }
}

exports.done = async (req, res) => {
    try {
        await Order.findOneAndUpdate({ _id: req.params._id }, { status: 2 }).populate('products._idProduct').exec(function (err, data) {
            if (err) {
                res.send(err);
                res.end();
            } else {
                let pointAdd = () => {
                    let sum = 0;
                    let point = '';

                    data.products.forEach(function (item) {
                        let cal = item._idProduct.price * item.quality;
                        sum += cal;
                    })

                    point = Math.round(sum * 9 / 14000)
                    User.findOneAndUpdate({ _id: data._uid }, { $inc: { point: point } }, function (err,user) {
                        if (err) {
                            res.send(err);
                            res.end();
                        } else {
                            let title = `Xin cảm ơn ${user.name}`
                            let content = `Giao hàng thành công, xin cảm ơn quý khách đã ủng hộ Hexia Coffee. Chúc quý khách ngon miệng !`
                            const message_option = {
                                token: user.fcmToken,


                                notification: {
                                    title: title,
                                    body: "Giao hàng thành công, xin cảm ơn quý khách đã ủng hộ Hexia Coffee. Chúc quý khách ngon miệng !",
                                },
                                data: {
                                    title:title,
                                    content:"Giao hàng thành công, xin cảm ơn quý khách đã ủng hộ Hexia Coffee. Chúc quý khách ngon miệng !"
                                }

                             
                            }
                            FBAdmin.admin.messaging().send(message_option).then(r => {
                                res.redirect('/admin/orders')
                            }).catch(e => {
                                res.json({
                                    msg:e
                                })
                            })
                        }

                    })

                }
                pointAdd();
            }
        })
    } catch (err) { res.send(err) }
}
//noti
const FBAdmin = require('../contants/firebase_config');

exports.update = async (req, res) => {


    let result = await Order.findByIdAndUpdate({ _id: req.params._id }, { status: 1 })
    let user = await User.findById({ _id: result._uid })
    const message_option = {
        token: user.fcmToken,
        notification: {
            title: `Xin chào ${user.name}`,
            body: `Đơn hàng của bạn đã được Hexia Coffee xác nhận và đang trên đường giao hàng. Chúc bạn thưởng thức ngon miệng !`,
        },
        data: {

        }
    }
    FBAdmin.admin.messaging().send(message_option).then(r => {
        res.redirect('/admin/orders')
    }).catch(e => {
        res.json({
            msg:e
        })
    })



}