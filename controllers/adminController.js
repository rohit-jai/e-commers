require('module-alias/register')
var pdf = require("pdf-creator-node");
var fs = require("fs");
const path = require('path')
const {options} = require('../helpers/option')
const randomstring = require("randomstring");
const QRCode = require('qrcode')
const userModel = require("@model/user.js")
const orderModel = require("@model/orders.js")
const addressModel = require("@model/address.js")
const bcrypt = require('bcryptjs');

// var ejs = fs.readFileSync("dummypdf.html", "utf8");



// var document = {
//     ejs: ejs,
//     data: {
//       users: users,
//     },
//     path: "./output.pdf",
//     type: "",
//   };


exports.redirectToLogin = (req,res)=>{
    //res.redirect('/admin/login')
        res.redirect('/login')
}

exports.login = (req,res)=>{
    if (req.session.isAuth) {
        res.redirect('/dashboard')
    }
    res.render('login')
}

exports.dashboard = (req,res)=>{
    if (!req.session.isAuth) {
        res.redirect('/admin')
    }
    
    res.render('dashboard')
}

exports.redirectToSignUP = (req,res)=>{
    res.render('signUp')
}

exports.loginCheck = async (req,res)=>{
       const validUser = await userModel.findOne({ email: req.body.email })
    if (validUser) {    
        if (validUser.status  && validUser.roll == 1) {  
            const isMatch = await bcrypt.compare(req.body.password, validUser.password)
            if (isMatch) {           
                req.session.isAuth = true
                sess = req.session;
                sess.userdata = validUser                          
                res.redirect('/admin/dashboard')
            }
            else {
                res.status(500).send('User Password is wrong ')
            }
        }
        res.status(500).send('Email is not verfied yet ')
    }
    else {
        res.status(500).send('there is not valid user email ')
    }
}

exports.logout = async(req,res)=>{
    // req.session.destroy((err) => {
    //     if (err) {
    //         res.send('there is an error in the logout ')
    //     }
    //     else {
    //         res.redirect('/admin')
    //     }

    // })
    req.session = null
    req.logout()
    res.redirect('/admin/login')   
}

exports.adminSignUp = async(req,res)=>{
    try {
        const encryptedPassword = await bcrypt.hash(password = req.body.password, 8);
        const token = randomstring.generate(15);
        //await sign.save()
        req.body.password=encryptedPassword
        req.body.token=token
        const sign = await userModel.create(req.body);
        res.status(200).redirect('/')
        // const link = `${process.env.BASE_URL}verify-user?token=${sign.token}`
        // res.status(201).send(`For email verification plese click on this link <a href='${link}'>${link}</a>`)

    } catch (err) {
        res.status(500).send("error is :" + err)
    }

}

exports.orders = async(req,res)=>{
    const orders = await orderModel.find().sort({_id:-1}).populate(['productId','userId'])
    
    //console.log('orders is : ' , orders);
    if(orders)
    {
        const addresses = await addressModel.find()
        res.render('orders',  { orders: orders, addresses:addresses })
        // console.log('orders',orders[0].userId[0]._id.toString());
        // console.log('addresses',addresses[0].user_id.toString());
        // //res.render('orders', data)
    }
    else
    {
        res.json({"Message":"Orders And Address Not Found "})

    }
}

exports.users = async(req,res)=>{
    const users = await  userModel.find({roll:2}).sort({_id:-1})
    if(users)
    {
        res.render('users', { users: users })
    }
    else
    {
        res.send('Users Not Find ')
    }
    //console.log('orders is : ' , orders);
}

//get orders form the address table 

exports.address = async(req,res)=>{
    req.session.isAuth = true
    sess = req.session;
    const getaddress = await addressModel.findOne({user_id:sess.userdata._id.toString()})
    if(getaddress)
    {
            // Converting the data into String format
                    let stringdata = JSON.stringify(getaddress)
                    
            //         // Print the QR code to terminal
            //         // QRCode.toString(stringdata,{type:'terminal'},
            //         //                     function (err, QRcode) {
                    
            //         //     if(err) return console.log("error occurred")
                    
            //         //     // Printing the generated code
            //         //     console.log(QRcode)
            //         // })
 
                    // QRCode.toDataURL(stringdata, function (err, code) {
                    //     if(err) return console.log("error occurred")                     
                    //     // Printing the code
                    //     //console.log(code)
                    //     res.render('front/useraddress',{code})
                    // })
                 //for print all detials of the user in the cart this below coding is ejs page coding in which we have to show details
                //     <p class="card-text">Area  : <%=getaddress.address1%> </p>
                // <p class="card-text">City  : <%=getaddress.city%> </p>
                // <p class="card-text">State  : <%=getaddress.state%> </p>
                // <p class="card-text">Zip Code  : <%=getaddress.zip%> </p>
                // <p class="card-text">Country  : <%=getaddress.country%> </p>

                // <!-- <div  style="margin-left: 82px" >
                //     <img src="<%=code%>">
                // </div> -->
        //new code

     
        const html = fs.readFileSync(path.join(__dirname,'../views/front/useraddress.html'),'utf-8')
        const filename =  Math.random() + '_doc' + '.pdf'
 
        var document = {
                html: html,
                data: {
                    getaddress: {
                        address1:getaddress.address1,
                        city:getaddress.city,
                        state:getaddress.state,
                        zip:getaddress.zip,
                        country:getaddress.country
                    },
                },
                path: "./docs/" + filename,
                type: "",
            }

        pdf
        .create(document, options)
        .then((res) => {
        console.log(res);
        })
        .catch((error) => {
        console.error(error);
        });
        const filepath = 'http://localhost:3000/docs/' +filename
        res.render('front/useraddress',{getaddress:getaddress,path:filepath})
        //res.render('front/download',{path:filepath})
        
        
    }
    else
    {        
        res.send('data not found ')
    }
}


exports.addressPdf = async (req,res,next) =>{    
    
    console.log('this file is runing ');
    const html = fs.readFileSync(path.join(__dirname,'../views/front/genratepdf.html'),'utf-8')
    const filename =  Math.random() + '_doc' + '.pdf'
    var users = [
        {
          name: "ro",
          age: "26",
        },
        {
          name: "Navjot",
          age: "26",
        },
        {
          name: "Vitthal",
          age: "26",
        },
      ];
    // HTML.setEncoding('utf8');
    // console.log(HTML.toString());
    var document = {
            html: html,
            data: {
              users: users,
            },
            path: "./docs/" + filename,
            type: "",
          }

          pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });

    const filepath = 'http://localhost:3000/docs/' +filename
    res.render('front/download',{path:filepath})

}