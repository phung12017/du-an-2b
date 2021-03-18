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

exports.getAll = async (req, res) => {

    const prods = await Product.find().sort({ _idCategory: -1 })
    //res.json(prods)
    res.render('./product/list', { prods })
};


exports.add = async (req, res) => {
    try {
        let cats = await Category.find({});
        res.render('./product/add', { cats });
    } catch (error) {
        res.json({ 'err': error })
    }
}



exports.edit = async (req, res) => {

    try {
        let cats = await Category.find({});
        let product = await Category.findOne({ _id: req.params._id });
        res.render('./product/add', { cats, product });
    } catch (error) {
        res.json({ 'err': error })
    }
};


exports.remove = async (req, res) => {

    await Product.findOneAndRemove({ _id: req.params._id }, function (err) {
        if (err) {
            res.json({
                err: err
            })
        } else {
            res.redirect('/admin/products')
        }
    })
};



exports.createProduct = async (req, res) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('A Multer error occurred when uploading .');
        } else if (err) {
            console.log('An unknown error occurred when uploading .');
        } else {
            console.log('upload is okay');
     
            if (req.body.title && req.body.price) {
                console.log(req.body.topping    )
                let product = new Product({
                    title: req.body.title,
                    price: req.body.price,
                    imageUrl: req.file.filename,
                    _idCategory: req.body.idCategory,
                    isActive: true,
                    size:{
                        small:null,
                        medium:req.body.haftSize *1,
                        large:req.body.haftSize * 2
                    },
                    // topping: [...req.body.topping]
                    
                })

                res.json(product)
                // product.save(function (err) {
                //     if (err) {
                //         res.json({
                //             kq: 0,
                //             err: err
                //         })
                //     } else {



                //         Category.findByIdAndUpdate({ _id: req.body.idCategory },
                //             { $push: { products: product._id } },
                //             function (err) {
                //                 if (err) {
                //                     json({ kq: 0, err: err })
                //                 } else {
                //                     res.redirect('/admin/menu')
                //                 }
                //             }
                //         )
                //     }
                // })


            }
        }
    })


}

