require('module-alias/register')
 const dotenv = require('dotenv');
 dotenv.config();
const randomstring = require("randomstring");
const addressModel = require("@model/address.js")
const productModel = require("@model/product")
const orderModel = require("@model/orders")
const ObjectID = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const { address } = require('./adminController');

const stripe = require('stripe')(process.env.Secret_key)

exports.addaddress = async (req, res) => {
    try {
        req.session.isAuth = true
        sess = req.session;
       // console.log("we get user data throw session " + sess.userdata._id);
        const productdata = await productModel.findById({ _id: req.params.id })
        if(productdata) {
                    const addressdata = await addressModel.find({user_id:sess.userdata._id})                   
                        res.render('front/cart',{product : productdata,address:addressdata})    
        }
        else
        {
            res.json({ "Error ": "Data is not persent " })
        }
    }
    catch (e) {
        res.json({ "Error": e.message })
    }
}

exports.shipaddress = async (req,res)=>{
    try{
        req.session.isAuth = true
        sess = req.session;        
        const data = await addressModel.find({user_id:sess.userdata._id})
       // console.log('data is ',data.length);
        if(data.length == 0)
        {
            //console.log(' part is runing ');
            req.body.user_id = sess.userdata._id
            const address = await addressModel.create(req.body)
            if(address)
            {
                req.body.productId=req.body.productid,
                req.body.userId = sess.userdata._id
                const orderData = await orderModel.create(req.body) 
               res.redirect('/front/userbookedcart/'+orderData._id)    
               // res.send(`Order Is booked Sucessfull Please Go To The Main Page <a href='/user/deshboard'>Back</a>` )
             }
            else
            {
                res.send('address is not saved ')
            }
        }
        else
        {           
            console.log('else part is runing ');            
            const updateData = await addressModel.findOneAndUpdate({user_id:sess.userdata._id},req.body)
            if(updateData)
            {
                req.body.productId=req.body.productid,
                req.body.userId = sess.userdata._id
                const orderData = await orderModel.create(req.body)                       
                //res.render('front/userbookedcart')
                //console.log('orderidis new : ',orderData._id);
                res.redirect('/front/userbookedcart/'+orderData._id)
            }
            else
            {
                res.send('address is not saved ')
            }
        }
    }
    catch(e)
    {
        res.send('error is ', e)
    }
}

exports.showBookedItem = async(req,res)=>{
    //console.log('orderid is : ' , req.params.orderId)
    const order = await orderModel.findOne({_id:req.params.orderId}).populate(['productId','userId']) 
   // console.log(" i have to see details of the user :" ,order); 
    if(order)
    {       
        const address = await addressModel.findOne({user_id:order.userId[0]._id})
        if(address)
        {
     
        res.render('front/userbookedcart',  { order: order, address:address ,key:process.env.Publishable_key })
        }
        else
        {
            res.send('There is something Error ')
        }
     }
    else
    {
        res.json({"Message":"Orders And Address Not Found "})

    }
}

exports.payment = (req,res)=>{

    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:req.body.name,
        address:{
            postal_code:req.body.zip,
            city:req.body.city,
            state:req.body.state,
            country:req.body.country,
        }
    })
    .then((customer)=>{
        return stripe.charges.create({
            amount:req.body.price,
            description:'for product',
            currency:'INR',
            customer:customer.id
        })
    })
    .then((charge)=>{
        console.log(charge);
        res.send("sucess")
    })
    .catch((e)=>{
        res.send("error is :" , e)
    })

}