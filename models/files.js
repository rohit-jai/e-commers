const mongoose = require('mongoose')
const filesupload = new mongoose.Schema({
    photo:{
        type:String,
            
    },
    zipfile:{
        type:Array,            
    }
    
},{ timestamps: true }  )

module.exports = mongoose.model('Filesupload',filesupload)

