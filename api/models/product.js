const mongoose = require('mongoose')

const Product = mongoose.model('Product', {
    name: {
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
     },
    category: { 
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true

    },
    image: String,
   
})

module.exports = { Product }