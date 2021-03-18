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
        let product = await Product.findOne({ _id: req.params._id });

        res.render('./product/edit', { product });
    } catch (error) {
        res.json({ 'err': error })
    }
};

exports.update = async (req, res) => {

    if (req.file) {
        try {
            json({ msg: 'upload file' })
        } catch (error) {
            json({ error: 'error' })
        }
    } else {
        json({ msg: 'update product' })
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
                const data = req.body.topping

                let topping = []
                for (let i = 0; i < data['name'].length; i++) {
                    if (data.name[i] && data.price[i]) {
                        topping.push({
                            'name': data.name[i],
                            'price': data.price[i]
                        })
                    }
                }

                let product = new Product({
                    title: req.body.title,
                    price: req.body.price,
                    description: req.body.description,
                    _idCategory: req.body._idCategory,
                    imageUrl: req.file.filename,
                    createAt: new Date(),
                    isActive: true,
                    size: {
                        small: null,
                        medium: req.body.haftSize * 1 || null,
                        large: req.body.haftSize * 2 || null
                    },
                    topping: topping,

                })


                product.save(function (err) {
                    if (err) {
                        res.json({
                            kq: 0,
                            err: err
                        })
                    } else {
                        Category.findByIdAndUpdate({ _id: req.body._idCategory },
                            { $push: { products: product._id } },
                            function (err) {
                                if (err) {
                                    res.json({ kq: 0, err: err })
                                } else {
                                    res.json({ product })
                                }
                            }
                        )
                    }
                })


            }
        }
    })


}

