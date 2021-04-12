const Notification = require('../models/notification');

exports.add = async (req, res) => {
    res.render('./notification/add');
}