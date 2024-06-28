const { Product } = require('../models/product')
const { openConnection, closeConnection, is_connected } = require('../helpers/database.js')
const { authorizeRole } = require('../helpers/middleware.js')



function filterProducts(req, res) {

    const query = req.swagger.params['search'].value
    openConnection()
    Product.find({
        $or: [
            { category: { $regex: query, $options: "$i" } }
        ]
    }, (err, products) => {
        if (err) {
            res.status(300).json(err)
        } else {
            if (products.length === 0) {
                res.status(200).json({
                    message: 'List of products is empty'
                })
            } else {
                res.status(200).json(products)
            }
        }
    })
    if (is_connected) closeConnection()
}

function getProducts(req, res) {
    const sort = req.swagger.params['sort']?.value
    openConnection()
    Product.find({}, (err, products) => {
        if (err) {
            res.status(300).json(err)
        } else if (products.length === 0) {
            res.status(200).json({
                message: 'List of products is empty'
            })
        } else {
            if (sort) {
                if (sort === "asc") {
                    let result = products.sort((a, b) => a.price - b.price)
                    res.status(200).json(result)
                } else {
                    let result = products.sort((a, b) => b.price - a.price)
                    res.status(200).json(result)
                }
            }
            else {
                res.status(200).json(products)
            }
        }
    })

    if (is_connected) closeConnection()
}

function addProduct(req, res) {
    if (authorizeRole(req, res, 'owner')) {
        openConnection()
        let product = new Product()
        product.name = req.body.name
        product.category = req.body.category
        product.description = req.body.description
        product.price = req.body.price
        if (req.files.image) {
            product.image = req.files.image[0].path
        }

        product.save().then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.status(300).json(err)
        })


        if (is_connected) closeConnection()
    }
}

  function setProduct(req, res) {
    if ( authorizeRole(req, res, 'owner')) {
        const id = req.swagger.params['id'].value
        openConnection()

          Product.findById(id, (err, product) => {
            if (err) {
                res.status(300).json(err)
            } else if (product === null) {
                res.status(404).json({
                    message: 'product not found'
                })
            } else {
                product.name = req.body.name
                product.category = req.body.category
                product.description = req.body.description
                product.price = req.body.price
                if (req.files.image) {
                    product.image = req.files.image[0].path
                }

                product.save().then(result => {
                    res.status(200).json(result)
                }).catch(err => {
                    res.status(300).json(err)
                })
            }
        })

        if (is_connected) closeConnection()
    }
}

function getProduct(req, res) {
    const id = req.swagger.params['id'].value

    openConnection()

    Product.findById(id).then(product => {
        if (product == null) {
            res.status(200).json({
                message: 'List of products is empty'
            })
        } else {
            res.status(200).json(product)
        }
    })
    if (is_connected) closeConnection()
}


function deleteProduct(req, res) {
    const id = req.swagger.params['id'].value
    openConnection()
    if (authorizeRole(req, res, 'owner')) {
        Product.findById(id, (err, product) => {
            if (err) {
                res.status(300).json(err)
            } else if (product === null) {
                res.status(404).json({
                    message: 'product not found'
                })
            } else {
                Product.deleteOne({ _id: id }).exec()
                res.status(200).json({
                    message: 'product deleted'
                })
            }
        })
    }
    if (is_connected) closeConnection()
}


module.exports = {
    getProducts,
    addProduct,
    setProduct,
    getProduct,
    deleteProduct,
    filterProducts


}
