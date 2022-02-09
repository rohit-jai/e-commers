require('module-alias/register')
const mongoose = require('mongoose')
const multiparty = require('multiparty');
const url = require('url')
const path = require('path');
const productModel = require("@model/product")
const categoryModel = require("@model/category")
const multer = require('multer')
 const ObjectID = require('mongodb').ObjectId;


exports.productAdd = async(req,res)=>{
    if (req.method == "POST") {        
        req.body.img = req.file.filename
          await productModel.create(req.body)
          .then((result)=>{   
            req.flash('mess',"Product Added  Sucessfully ")          
              res.redirect('/admin/products')
          })
          .catch((err)=>{
              res.send('data is not saved : ' + err)
          })
    }
    else
    {
        await categoryModel.find({"status":1})
        
        .then((result)=>{          
          //  console.log("category data is : " ,result);
            res.render('product-add',{categories:result})
            
        })
        .catch((err)=> res.send(err))
    }
  
}

exports.products = async(req,res)=>{
    const products = await productModel.find().populate('cat_id')
    //  console.log("product and category data", products[0].cat_id);
    // products.map((p)=>{
    //     console.log("p!!!!!!!!!!!", p, p.cat_id);
    // })
    var mess = req.flash('mess')
    const getdata = {
        "products": products,      
         "mess" : mess
    }
    res.render('product', { getdata: getdata })
}

exports.productDelete = async (req, res) => {  
    
         await productModel.findByIdAndDelete({ _id: req.params.id })
            .then((res) => {
                res.send('data is delete')
            })
            .catch((err) => {
                req.flash('mess',"Product Deleted Sucessfully ")
                res.redirect('/admin/products')
            })

}

exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!file) return cb(new Error('Upload file error'), null)
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        if (file) {
            const extFile = file.originalname.replace('.', '')
            const extPattern = /(jpg|jpeg|png|pdf|jfif)/gi.test(extFile)
            if (!extPattern) return cb(new TypeError('File format is not valid'), null)
            //if (!extPattern) return cb.send({  "responceMassage": "file formet is not valid  " })
            req.photo = file.originalname
            return cb(null, file.fieldname +'_'+Date.now() + path.extname(file.originalname))
        }
    }
})

exports.productedit = async(req,res)=>{
    // console.log("req.body",req.body);
    if(req.method == "POST") 
    {  
    }
    else{
        await productModel.findById(req.params.id).populate('cat_id')
     .then(async(product)=>{        
         await categoryModel.find({"status":1})
        .then((categories)=>{
            res.render('product-add',{product:product,categories:categories})
        })
        .catch((err)=> res.send(err))          
      })
      .catch((err)=> res.send(err)) 
    }
}

exports.productupdate = async(req,res)=>{
    // console.log(req.body)
    // console.log(req.params.id)
    req.body.img = req.file.filename
    await productModel.updateOne({_id:req.params.id},req.body)
    req.flash('mess',"Product Updated  Sucessfully ")
    res.redirect('/admin/products')  
}

