const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userOrders = new mongoose.Schema({
    productId:[{
        type:Schema.Types.ObjectId,
        ref: 'product'     
    }],
    userId:[{
        type:Schema.Types.ObjectId,
        ref: 'User'     
    }],
    date:{
        type:Date,
        default:Date.now               
    },
    status:{
        type:Number,
        default:0     
    } 
})
module.exports = mongoose.model('userOrders',userOrders)

