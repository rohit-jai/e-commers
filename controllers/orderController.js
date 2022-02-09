require('module-alias/register')
const randomstring = require("randomstring");
const orderModel = require("@model/orderController.js")
const ObjectID = require('mongodb').ObjectId;


exports.getOrders = async (req,res) => {
    try{
        req.body.productId = 
        await orderModel.create(req.body)

    }
    catch(e)
    {

    }

}