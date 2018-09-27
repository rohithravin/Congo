var express=require('express')
var app=express()
var bodyParser=require('body-parser')
var path=require('path')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './public/dist/public')))

app.get('/', function(request, response){
    response.send("You are good!")
})
app.all('*', (request, response, next)=>{
  response.sendFile(path.resolve('./public/dist/public/index.html'))
})

app.listen(8000, function(){
    console.log("Listening on port 8000")
})
