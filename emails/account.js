const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const nodemailer  =  require('nodemailer')

const transporter =  nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }

})


    function mail(email,link)  {
       // console.log('link on the account page '+link);
        const mailOptions = {
            from:'rohitjaiswal716@gmail.com',
            to: email,
            subject:'Forget Password ',
            html : `Successfully email sent on this  ${email} and click this link for change the password <a href="${link}">Link</a>`
        }
        
        transporter.sendMail(mailOptions,(err,res)=>{
            if(err)
            {
                console.log('error is :' +err);
            }
            else{
                console.log('email send .....');
            }          
           
        })   

    }
   
module.exports = {
    mail
}
