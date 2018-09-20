var express=require('express')
var app=express()
var path=require('path')

app.use(express.static(path.join(__dirname, './public/dist/public')))

app.get('*')

app.listen(8000, function(){
    console.log("Server is listening on port 8000")
})
