const express = require('express')
require('module-alias/register')
const logger = require("./database/logger")
const mongoose = require('mongoose')
const path = require('path')
const apirouters = require("@routes/api.js")
const dotenv = require('dotenv');
dotenv.config();
const bodyParser =  require('body-parser')
const { url } = require("@database/config")
const session = require('express-session')
var flash = require('connect-flash')



const passport = require('passport')
const MongoDBSession = require('connect-mongodb-session')(session)
var cookieSession = require('cookie-session')

const port = process.env.port;
const app = express()
app.use(express.json())
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.static('images'));
//path.join(__dirname, "./uploads/image.png")
console.log(path.join(__dirname, ));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use('/docs',express.static(path.join(__dirname, 'docs'))); // this one is used for download the pdf file 


// ues of the twillo app

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

// var accountSid = "AC1d42fa4cefe3cc2e31454999205f1aab"// process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
// var authToken = "2cb25ea135de845e6a4125f58258a04d" // process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

    //  function sendMassage(){
    //         client.messages.create({
    //             body: 'Hi there', 
    //             from: '+12284324795', 
    //             to: '+917988314470'})
    //             .then(message => console.log('msg is send from the mail :'+message.sid))
    //             .catch(error => console.log(error))
    //     }

       // sendMassage();



const store = new MongoDBSession({
    uri:url,
    collection:'mysession',
    //expires: new Date(Date.now() + (30000)) 

})

app.use(cookieSession({
    name: 'auth-session',
    keys: ['key1', 'key2']
  }))

app.use(session(
    { secret: "secret", 
    store: store,
    resave:false,
    saveUninitialized:false,
    // maxAge: Date.now() + ( 30000) ,
    cookie: {
        secure:false,       
        maxAge:1000*60*20   
      }
    }));
    app.use(flash())
    app.use(passport.initialize());
    app.use(passport.session());

app.use((req,res,next)=>{
    logger.info(req.body);
    let oldSend = res.send;
    res.send = function (data) {
        logger.info(data.toString())
        oldSend.apply(res,arguments)
    }
    next();
})

app.use(apirouters)


mongoose.connect(url).then((res) => {
    console.log('data base is created ');;
}).catch((err) => {
    console.log('database is not created  ');
})

app.listen(port, () => console.log(`Your port is ${port}`));