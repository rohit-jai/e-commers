const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userAddress = new mongoose.Schema({
    user_id:[{
        type:Schema.Types.ObjectId,
        ref: 'User'     
    }],
    address1:{
        type:String,                
    },
    address2:{
        type:String,       
    },
    city:{
        type:String,               
    },
    state:{
        type:String,       
    },
    zip:{
        type:Number,      
    },
    country:{
        type:String,        
    }   
})

module.exports = mongoose.model('UserAddress',userAddress)

