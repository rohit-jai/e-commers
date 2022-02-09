const mongoose = require('mongoose')
const userSign = new mongoose.Schema({
    firstName:{
        type:String,
            
    },
    lastName:{
        type:String,
       
           
    },
    email:{
        type:String,
        unique:true,
       
    },
    password:{
        type:String,
                
    },
    mobile:{
        type:String,
        unique:true,
       
    },
    create:{
        type:Date,
        required:true,
        default:Date.now
    },
    roll:{
        type:Number,
        default:2
    },
    status:{
        type:Number,
        default:1
    },
    token:{
        type:String
    }    
})

module.exports = mongoose.model('User',userSign)

