const Product = require('../models/product');
const Category = require('../models/category');

// multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({
    storage: storage,
}).single('file')

exports.getByCate = async (req, res) => {
    const _id = req.params._id

    const cate = await Category.findOne({ _id: _id })
    const prods = await Product.find({ _idCategory: _id })

    res.render('./admin/menu-product', { cate, prods })
};


exports.createProduct = async (req, res) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('A Multer error occurred when uploading .');
        } else if (err) {
            console.log('An unknown error occurred when uploading .');
        } else {
            console.log('upload is okay');
            console.log(req.file);
            if (req.body.title && req.body.price) {
                let product = new Product({
                    title: req.body.title,
                    price: req.body.price,
                    imageUrl: req.file.filename,
                    _idCategory: req.body.idCategory,
                    isActive: true
                })
                product.save(function (err) {
                    if (err) {
                        res.json({
                            kq: 0,
                            err: err
                        })
                    } else {

                  
                        Category.findByIdAndUpdate({ _id: req.body.idCategory },
                            { $push: { products: product._id } },
                            function (err) {
                                if (err) {
                                    json({ kq: 0, err: err })
                                } else {
                                    res.redirect('/admin/menu')
                                }
                            }
                        )
                    }
                })


            }
        }
    })


}

exports.getCateById = async (req,res)=>{
    const params =req.params._id
    res.render('./product/product-add',{params})
}