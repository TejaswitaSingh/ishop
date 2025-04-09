const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            required: true
        },
        product_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'product',
            required: true
        },
        qty:{
            type: Number,
            min:1,
            required: true,
            default: 1
        }
    },
    {
        timestamps: true,
    }
)
const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;