require('module-alias/register')
const express = require('express')
const path = require('path');
const multer = require('multer')
const fileModel = require("@model/files")


exports.fileadd = (req,res)=>{
    res.render('front/multifileupload')
}


exports.multistorage = multer.diskStorage({
    destination: function (req, file, cb) {
     // cb(null, "public/uploads");
     cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });


  exports.fileFilter = (req, file, cb) => {
    if (file.fieldname === "file2") { // if uploading resume

        //console.log('this is file 2',file.mimetype);
      if (
          
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/zip' ||
        file.mimetype === 'application/x-zip-compressed'

      ) { // check file type to be pdf, doc, or docx
       
        cb(null, true);
      } else {
        cb(null, false); // else fails
      }
    } else { // else uploading image
       // console.log('this is file 1',file.mimetype);
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' 
      ) { // check file type to be png, jpeg, or jpg
        console.log("hee pic");
        cb(null, true);
      } else {
        cb(null, false); // else fails
      }
    }
  };

  exports.fileupload = async(req,res)=>{
    if(req.files){         
        req.body.photo = req.files.file1[0].filename
        req.body.zipfile = [];
        req.files.file2.forEach(async(value,index)=>{
          req.body.zipfile.push(value.filename)
        })
        //let data = await fileModel.create({ "photo": req.files.file1[0].path,"zipfie": req.files.file2[0].path})
        let data = await fileModel.create(req.body)

        if(data)
        {
          req.flash('mess',"File Uploded Sucessfully ")
          res.redirect('/user/multifileget')
           // res.json({"Message":"File Is uploded ","Data":data})
        }
        else
        {
            res.send('file is not upload sucessfully')
        }        
    }
    else
    {
        res.send('there is no any file for upload ')
    }

  }


  exports.showData = async(req,res)=>{
      try
      {
        const data = await fileModel.find()      
        var mess = req.flash('mess')
        res.render('front/showmultiple',{result:{"multiplefile":data,"mess":mess}})
      }
      catch(e){
        res.json({'Error' : e.message} )
      }
    //   const data = await fileModel.find()
    //   if(data)
    //   {
    //     res.json({ "Data": data })
    //   }
    //   else
    //   {
    //       res.send('Data is Not Persent ')
    //   }


  }