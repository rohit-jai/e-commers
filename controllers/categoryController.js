require('module-alias/register')
const path = require('path');
const url = require('url');
const multer = require('multer')
const swal = require('sweetalert')

const ObjectID = require('mongodb').ObjectId;
const categoryModel = require("@model/category");

exports.categories = async (req,res)=>{
    const categories = await categoryModel.find()
    //var message = req.query.message;
    var mess = req.flash('mess')
    const data = {
        "categories": categories,
        // "message" : message,
         "mess" : mess
        //"user": sess.userdata
    }
    
    res.render('category', { data: data })
    
}

exports.categoryAdd = async (req,res)=>{
    if (req.method == "POST") {
      //  console.log(req.body);
        req.body.img = req.file.filename
        await categoryModel.create(req.body)
        .then((result)=>{
           
            req.flash('mess',"Category Added Sucessfully ")           
            res.redirect('/admin/categories')
        })
        .catch((err)=>{
            res.send('data is not saved ')
        })
     }
    res.render('category-add')

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


exports.categoryDelete = async (req,res)=>{       
    const q = url.parse(req.url, true)
    // console.log(q);  
    const qdata = q.query;
         await categoryModel.findByIdAndDelete({ _id: qdata.id })
            .then((res) => {
                res.send('data is delete')
                
            })
            .catch((err) => {
                req.flash('mess',"Category deleted Sucessfully ")
               // var message = "Category deleted successfully";
               // res.redirect('/admin/categories?message=' + message)                
                res.redirect('/admin/categories' )                
                
            })

}

exports.categoryEdit = async(req,res)=>{
    if (req.method == "POST") {
        //console.log(req.params.id);
        req.body.img = req.file.filename
        await categoryModel.findByIdAndUpdate({_id:req.params.id},req.body,(err,docs)=>{
            if(err)
            {
                console.log('something went wrong to upate your data');
                next(err)
            }
            else
            {
                req.flash('mess',"Category Updates Sucessfully ")
                res.redirect('/admin/categories')
            }
    
        })
    }
    else
    {
        await categoryModel.find({_id:req.params.id})
        .then((result)=>{
            res.render('category-add', { data: result })
        })
        .catch(err=> console.log("data is not getting "))
    }
    

}
