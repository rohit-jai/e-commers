const express = require('express')
const api_router = express.Router()
const adminController = require('@controller/adminController.js')
const categoryController = require('@controller/categoryController.js')
const userController = require('@controller/userController.js')
const productController = require('@controller/productController.js')
const fileController = require('@controller/fileController.js')
const addressController = require('@controller/addressController.js')

const passport = require('passport')
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const multer = require('multer')
const { storage } = require('@controller/categoryController.js')
const { multistorage } = require('@controller/fileController.js')
const { fileFilter } = require('@controller/fileController.js')

  const isloggedIn =  (req, res, next) =>{
      if(req.user)
      {
          next()
      }
      else{
          res.sendStatus(401)
      }
  }


const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect('/admin')
    }
}

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    }
}).single("img")


var multiupload = multer({
     storage: multistorage,
     fileFilter: fileFilter,
     limits: {
        fileSize: '20mb'
    }
    
     });

var uploadMultiple = multiupload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 3 }])


api_router.get('/signup',adminController.redirectToSignUP)
api_router.get('/admin',adminController.redirectToLogin)
api_router.get('/admin/login',adminController.login)
api_router.post('/admin/login-check',adminController.loginCheck)
api_router.get('/admin/logout',adminController.logout)
api_router.post('/signup',adminController.adminSignUp)
api_router.get('/admin/dashboard',isAuth,adminController.dashboard)
api_router.get('/admin/orders',isAuth,adminController.orders)
api_router.get('/admin/users',isAuth,adminController.users)



api_router.get('/admin/categories',isAuth,categoryController.categories)
api_router.get('/admin/categories/add',categoryController.categoryAdd)
api_router.post('/admin/categories/add',upload,categoryController.categoryAdd)
api_router.get('/admin/categories/delete',isAuth,categoryController.categoryDelete)
api_router.get('/admin/categories/:id',isAuth,categoryController.categoryEdit)
api_router.post('/admin/categories/:id',isAuth,upload,categoryController.categoryEdit)


api_router.get('/admin/products',productController.products)
api_router.get('/admin/products/add',isAuth,productController.productAdd)
api_router.get('/admin/products/:id',isAuth,productController.productedit)
api_router.post('/admin/products/add',isAuth,upload,productController.productAdd)
api_router.post('/admin/products/edit/:id',isAuth,upload,productController.productupdate)
api_router.get('/admin/products/delete/:id',isAuth,productController.productDelete)

//api_router.get('/',userController.index)
api_router.get('/',userController.login)
api_router.post('/login-check',userController.loginCheck)
api_router.post('/send-otp',userController.sendOtp)
api_router.post('/verify-otp',userController.verifyOtp)
api_router.get('/logout',userController.userlogout)
api_router.get('/user/deshboard',userController.userdashboard)
api_router.get('/user/product',isAuth,userController.userProducts)

// this is the map api using for find the hard coded location 
api_router.get('/user/getmap',isAuth,userController.userGetMap)



// api_router.get('/user/geoloaction',userController.geoloaction)


// the below controller are belongs to the multifile upload 

api_router.get('/user/fileUpload',isAuth,fileController.fileadd)
api_router.post('/uploadfile', uploadMultiple, fileController.fileupload)
api_router.get('/user/multifileget',isAuth,fileController.showData)

// get address from the address table 
api_router.get('/user/getaddress',adminController.address)
api_router.get('/user/pdf',adminController.addressPdf)






// go to the mail concept 

api_router.get('/user/forgotpassword',userController.userForgotPassword)
api_router.post('/forgotPassword',userController.userVerifyEmail)
api_router.get('/user/verify-forgot-password/:token',userController.updatePassword)
api_router.post('/user/updatePassword/:token',userController.userUpdatePassword)
api_router.post('/user/password-change',isAuth,userController.userSelfPasswordUpdate)
api_router.get('/user/passwordChange',isAuth,userController.selfPasswordChange)

// carts apis

api_router.get('/cart/:id',isAuth,addressController.addaddress)
api_router.post('/cart/add-address',addressController.shipaddress)

api_router.get('/front/userbookedcart/:orderId',addressController.showBookedItem)
api_router.post('/front/userbookedcart/payment',addressController.payment)




api_router.get('/failed',(req,res)=>{
    res.send('you are failed to login ')
})

api_router.get('/good',isloggedIn,userController.loginWithGoogle)
// (req,res)=>{
//     console.log('userName is  ' + req.user.displayName );
//     console.log('userName is  ' + req.user.serverAuthCode   );
//     console.log('userName is  ' + req.user.idToken  );
//     console.log('userName is  ' + req.user.email  );

//     req.session.isAuth = true
//     sess = req.session; 
//     const userdata = {firstName:req.user.displayName,email:req.user.email,mobile:req.user.mobile}
//     sess.userdata = userdata 
//     res.redirect('/user/deshboard')
// }  )

api_router.get('/google', passport.authenticate('google', { scope:
    [ 'email', 'profile'  ] }
));

api_router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/good',
        failureRedirect: '/failed'
}));

module.exports=api_router