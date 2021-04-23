const Product = require('../models/product');
const Category = require('../models/category');

// multer
const multer = require('multer');
const { json } = require('body-parser');
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



exports.remove = async (req, res) => {

    try {

        let r1 = await Product.findByIdAndRemove({ _id: req.params._id })
        if (r1) {
            let result = await Category.findOneAndUpdate({
                _id: r1._idCategory
            },

                {
                    $pull: {
                        products: r1._id
                    }
                }
            )
            res.redirect('/admin/products')
        }


    } catch (error) {
        res.json({ msg: error })
    }

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
             
                let product = new Product({
                    title: req.body.title,
                    price: req.body.price,
                    description: req.body.description,
                    _idCategory: req.body._idCategory,
                    imageUrl: req.file.filename,
                    createAt: new Date(),
                    isActive: true,
               

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
                                    res.json({ msg: 'err' })
                                } else {
                                    res.redirect('/admin/products')

                                }
                            }
                        )
                    }
                })


            }
        }
    })


}
exports.update = async  (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log('A Multer error occurred when uploading .');
        } else if (err) {
            console.log('An unknown error occurred when uploading .');
        } else {
            if (req.file) {


                if (req.body.title && req.body.price) {
           
                    try {
                        let result =   await Product.findOneAndUpdate({ _id: req.params._id }, {
                            title: req.body.title,
                            price: req.body.price,
                            description: req.body.description,
                            imageUrl: req.file.filename,
                            isActive: true,
                        

                        })

                        res.redirect('/admin/products')
                    } catch (error) {
                        res.json({ msg: error })
                    }

                }
            } else {

                try {
                    let result = await Product.findOneAndUpdate({ _id: req.params._id }, {
                        title: req.body.title,
                        price: req.body.price,
                        description: req.body.description,

                        isActive: true,
                    

                    })


                    res.redirect('/admin/products')

                } catch (error) {
                    res.json({ msg: error })


                }

            }

        }
    })

};