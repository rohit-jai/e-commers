const mongoose = require('mongoose')
const categories = new mongoose.Schema({
    name:{
        type:String,
        required:true      
    },
    parentId:{
        type:String,
           
    },
    img:{
        type:String,
        required:true
               
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

module.exports = mongoose.model('Categories',categories)

