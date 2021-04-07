const User = require('../models/user');
exports.getAll = async (req, res) => {
    await User.find({},function(err,data){
        if(err){
            res.send(err);
            res.end();
        }else{
            res.render('./user/list',{users: data});
            res.end();
        }
    }).sort({"point":-1})
}