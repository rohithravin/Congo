const nodemailer=require('nodemailer')
const xoauth2 = require('xoauth2')

var transporter=nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    auth:{
        user:'congo30700@gmail.com',
        pass:'Dunsmore180',
        xoauth2:xoauth2.createXOAuth2Generator({
            user:'congo30700@gmail.com',
            clientId:'307339350402-s3quf7smb0t6ltr7dqdlp3olfo2k83fb.apps.googleusercontent.com',
            clientSecret:'ERUinG4i9XzdjSOpn_n2XLXT', 
            refreshToken:'1/PoglDS8uVDl2m6NgU4OZcgCuK6Cs1Rmrp6QS4jBDfUM'
        }),
    },
    tls: {
        rejectUnauthorized: false
    }
})

var mailerOptions={
    from:'Congo <congo30700@gmail.com>',
    to:'mahesh.ashwin1998@gmail.com',
    subject:'Congo Message',
    text:'Hello Ashwin, This is from Congo!'
}

transporter.sendMail(mailerOptions, function(error, response){
    if(error){
        console.log(error)
    }
    else{
        console.log("Email sent!")
    }
})