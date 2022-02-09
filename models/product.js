const mongoose = require('mongoose')
const Schema = mongoose.Schema
const product = new mongoose.Schema({
    cat_id:[{
        type:Schema.Types.ObjectId,
        ref: 'Categories'     
    }],
    name:{
        type:String,
        required:true           
    },
    mrp:{
        type:Number,
        required:true               
    },
    price:{
        type:Number,
        required:true               
    },
    img:{
        type:String,
        
               
    },
    status:{
        type:String,
        default:1
    },
    createat:{
        type:Date,
        required:true,
        default:Date.now
    },
    updatedat:{
        type:Date,
    } 
})

module.exports = mongoose.model('product',product)

