var express=require('express')
var app=express()
var path=require('path')

app.use(express.static(path.join(__dirname, './public/dist/public')))
app.all('*', (request, response, next)=>{
    response.sendFile(path.resolve('./public/dist/public/index.html'))
})
app.listen(8000, function(){
    console.log("Server is listening on port 8000")
})