require('module-alias/register')
const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const path = require('path')
const { mail } = require('@emails')
const randomstring = require("randomstring");
const userModel = require("@model/user.js")
const productModel = require("@model/product.js")
const bcrypt = require('bcryptjs');
const CircularJSON = require('circular-json')
const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console / if we try to print direct then we have to used prameter inside double quotes  " "
var authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var rn = require('random-number');
const { render } = require('ejs');
const logger = require('../database/logger');



exports.loginCheck = async (req, res) => {
    const validUser = await userModel.findOne({ email: req.body.email, roll: 2 })
    if (validUser) {
        if (validUser.status && validUser.roll == 2) {
            const isMatch = await bcrypt.compare(req.body.password, validUser.password)
            if (isMatch) {
                req.session.isAuth = true
                sess = req.session;
                sess.userId = validUser._id

                res.json({ "status": "sucess", "mobile": validUser.mobile })
                // res.send('sucess full login')
            }
            else {
                res.json({ "status": "failed", "message": 'Password is wrong' })
                //res.status(500).send('User Password is wrong ')
            }


        }
        else {
            res.json({ "status": "failed", "message": 'Email is not verfied yet' })
            // res.status(500).send('Email is not verfied yet ')
        }

    }
    else {
        res.json({ "status": "failed", "message": 'there is not valid user email' })
        //res.status(500).send('there is not valid user email ')
    }
}


// exports.login = (req,res)=>{

//     // if (req.session.isAuth) {
//     //     res.redirect('/dashboard')
//     // }
//      res.render('userlogin')
// }

exports.login = (req, res) => {
    if (req.session.isAuth) {
        // res.send(`welcome user ${req.user.displayName} `)
        // res.render('userdashboard')
        res.redirect('/user/deshboard')
    }
    else {
        res.render('userlogin')
    }

}

exports.userdashboard = async (req, res) => {
    res.render('userdashboard')
}





// exports.index = async (req,res)=>{
//    if(req.session)
//     {
//         // req.session.isAuth = true
//     //     sess = req.session;
//     //     sess.isUserLogin = true

//     //  await    console.log('user data is :' +sess.userData );
//     //     res.status(200).send(sess.userData)
//         res.render('index')
//         //,{data:sess.userData}
//        //console.log("session data is : " +sess.userData);
//     }
//     else
//     {
//         res.redirect('/login')
//     }

// }

exports.sendOtp = async (req, res) => {
    console.log('user mobile number is :', '+91' + req.body.mobile);
    var id = sess.userId.toString()
    const user = await userModel.findOne({ _id: id, mobile: req.body.mobile })
    if (user) {
        const options = {
            min: 1000
            , max: 9999
            , integer: true
        }
        const otp = rn(options)
        console.log('otp is :' + otp);

        req.session.isAuth = true
        sess = req.session;
        sess.userotp = otp
        // console.log("user otp is :" ,otp);
        // sess.userData = user
        // console.log("session of username is : " ,sess.username);
        res.json({ "status": "sucess" })



        //    const userotp =  client.messages.create({
        //         body: 'Hi Your Otp is : '+otp, 
        //         from: '+12284324795', 
        //         to: '+91'+req.body.mobile 
        //     })
        //     if(userotp)
        //     {
        //         res.json({"status":"sucess"})
        //     }
        //     else
        //     {
        //         res.json({"status":"failed"});
        //     }
    }
    else {
        res.json({ "status": "falied", "message": "Invalid Mobile Number" })
    }
}


exports.verifyOtp = async (req, res) => {
    if (req.body.otp == sess.userotp) {
        req.session.isAuth = true
        sess = req.session;
        var id = sess.userId.toString()
        //  console.log('user id is  : ' , id)
        const userdata = await userModel.findOne({ _id: id })
        sess.isUserLogin = true
        sess.userdata = userdata
        // console.log('session user data : ' + sess.userdata);
        logger.log('info', ` ${userdata.firstName} Login is sucessfull `)
        res.json({ "status": "sucess" })

    }
    res.json({ "status": "fail" })
}

exports.userlogout = async (req, res) => {
    req.session.isAuth = true
    sess = req.session;
    req.session = null
    req.logout()
    res.redirect('/')
    logger.log('info', `${sess.userdata.firstName}  is logout`)
}

passport.serializeUser(function (user, done) {
    //done(null, user.id);
    done(null, user);
});

// passport.deserializeUser(function(id, done) {
passport.deserializeUser(function (user, done) {
    //  User.findById(id, function(err, user) {
    done(null, user);
    // });
});

passport.use(new GoogleStrategy({

    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL //"http://localhost:3000/google/callback",
    //passReqToCallback   : true
},
    function (accessToken, refreshToken, profile, done) {
        // use the profile info (mainly profile Id) to check if the user is require in your db 
        //User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
        // });
    }
));

exports.loginWithGoogle = async (req, res) => {
    // console.log('userName is  ' + req.user.displayName );
    // console.log('userName is  ' + req.user.serverAuthCode   );
    // console.log('userName is  ' + req.user.idToken  );
    // console.log('userName is  ' + req.user.email  );
    const userfind = await userModel.findOne({ email: req.user.email })
    if (userfind) {
        req.session.isAuth = true
        sess = req.session;
        sess.userdata = userfind
        res.redirect('/user/deshboard')
    }
    else {

        await userModel.create({

            firstName: req.user.displayName,
            email: req.user.email
        })
            .then((result) => {
                req.session.isAuth = true
                sess = req.session;
                sess.userdata = result

                res.redirect('/user/deshboard')
            })
            .catch((err) => { res.send('unable to create user : ' + err) })
    }

    // req.session.isAuth = true
    // sess = req.session; 
    // const userdata = {firstName:req.user.displayName,email:req.user.email,mobile:req.user.mobile}
    // sess.userdata = userdata 
    // res.redirect('/user/deshboard')
}

exports.userProducts = async (req, res) => {
    await productModel.find({ status: 1 }).populate('cat_id')
        .then((result) => {
            res.render('front/product', { products: result })
        })
        .catch((err) => {
            res.send('Data is not Listing ' + err)
        })

}


exports.userForgotPassword = (req, res) => {
    res.render('front/forgotPassword')
}

exports.userVerifyEmail = async (req, res) => {
    const validUser = await userModel.updateOne({ email: req.body.email, roll: 2 }, { token: randomstring.generate() })
    // console.log('valid user is find ' , validUser);
    if (!validUser) {
        res.json({ "Message": "Not a  valid Email Please Enter a valid Email" })
    }
    else {
        const detials = await userModel.findOne({ email: req.body.email })
        // console.log(detials);
        if (!detials) {
            res.json({ "Message": `User is not found by this given Email ${req.body.email}` });
        }
        else {
            const link = `localhost:3000/user/verify-forgot-password/${detials.token}`
            mail(detials.email, link)
            res.status(200).json({ "Message": "Please Check Email For Reset Password" })
            // const sendemail = await mail(detials.email,link);
            // console.log(sendemail);
            // if(!sendemail)
            // {
            //   res.status(500).send({massage:'Email is not send because email is not valid '})
            // }else
            // {
            //   res.status(200).send({massage:'Email is send and check your email  '})
            // }

        }
    }

}


exports.updatePassword = async (req, res) => {
    try {

        const user = await userModel.findOne({ token: req.params.token })

        if (!user) {
            res.json({ "Message": "Wrong Link" })
        }
        else {
            res.render('front/change-password', { token: req.params.token })
        }
    }
    catch (e) {
        res.json({ "Error is ": e.message })
    }
}

exports.userUpdatePassword = async (req, res) => {
    const encryptedPassword = await bcrypt.hash(req.body.password, 8)
    // console.log('encrypted password is : ',encryptedPassword);
    const passwordUpdate = await userModel.updateOne({ token: req.params.token }, { password: encryptedPassword, token: '' })
    if (!passwordUpdate) {
        res.json({ "Message": "Password is not updated" })
    }
    else {
        res.json({ "Message": "Password updated" })
    }
}

exports.selfPasswordChange = async (req, res) => {
    var mess = req.flash('mess')   
    res.render('front/selfChange-password',{result:mess})
}

exports.userSelfPasswordUpdate = async (req, res) => {
    try {
        req.session.isAuth = true
        sess = req.session;
        var id = sess.userId.toString()
        const user = await userModel.findOne({ _id: id })
        if (!user) {
            res.json({ "Message": "User is not persent" })
        }
        else {

            const isMatch = await bcrypt.compare(req.body.oldpassword, user.password)
            if (!isMatch) {
                res.json({ "Message": "Your old password is Not Right Please Enter Right old password " })
            }
            else {
                const encryptedPassword = await bcrypt.hash(req.body.password, 8)
                const updateDetails = await userModel.updateOne({ _id: id }, { password: encryptedPassword })
                if (!updateDetails) {
                    res.json({ "Message": "Password is not updated" })
                }
                else {
                    req.flash('mess',"User password Changed Sucessfully ")
                    res.redirect('/user/passwordChange')
                    //res.json({ "Message": "Password is updated" })
                }

            }
        }

    }
    catch (e) {
        res.json({ "Error is ": e.message })

    }

}

// exports.geoloaction = (req,res) => {

//  const outhclient = new google.auth.oAuth2()
//  {
//     "584485012373-c732krndtbqsehb8tl7msc9i8n2fht16.apps.googleusercontent.com"
//     "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"
//     "http://localhost:1234/steps"
//  }
// const scopes

// src="https://maps.googleapis.com/maps/api/js"

// }


exports.userGetMap = async (req, res) => {
    res.render("front/map")
    // console.log(express.static(path.join(__dirname, '/public')));
    // res.sendFile(__dirname + '/../views/front/index.html');
    //res.sendFile('/views/front/index.html')
    
}