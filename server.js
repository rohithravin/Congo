var express=require('express')
var app=express()
var path=require('path')
var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyARn1Y5ytOrRpFjcVKtmR5yQnllMF0gZbg",
    authDomain: "congo3070.firebaseapp.com",
    databaseURL: "https://congo3070.firebaseio.com",
    storageBucket: "congo3070.appspot.com",
  };
firebase.initializeApp(config);
var defaultDatabase = firebase.database();


app.use(express.static(path.join(__dirname, './public/dist/public')))
app.all('*', (request, response, next)=>{
    response.sendFile(path.resolve('./public/dist/public/index.html'))
})
app.listen(8000, function(){
    console.log("Server is listening on port 8000")
})