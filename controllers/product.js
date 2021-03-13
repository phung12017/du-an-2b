 const product = require('../models/product');

 
exports.createProduct = async (req, res) => {

    const sizes = req.body.sizes
    res.json({msg:'createProduct',sizes})
};


 
 
 