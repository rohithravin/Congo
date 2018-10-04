var express=require('express')
var app=express()
var path=require('path')
var mongoose=require('mongoose')

// Firestore DB
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://congo3070.firebaseio.com"
});
var db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

// Mongoose DB
mongoose.connect('mongodb://localhost/CongoDB')
var UserSchema = new mongoose.Schema({
    first_name:{type:String, required:[true, "First name is required."], minlength:2},
    last_name:{type:String, required:[true, "Last name is required"], minlength:2},
    email:{type:String, required: [true, "Email is required"], minlength:5},
    password:{type:String, required:[true, "Password is required"], minlength:[8, "Password must be atleast 8 characters"]},
    user_level:{type:Number, default:1},
    phone_number:{type:String, required:[true, "Phone number is required"], minlength:[10, "Invalid phone number"], maxlength:[10, "Invalid phone number"]},
    stream:{type:Boolean, default:false, required:[true, "Stream is required"]},
    cart:["CartSchema"]
}, {timestamps:true});
mongoose.model('User', UserSchema)
var User = mongoose.model('User')

var MerchantSchema = new mongoose.Schema({
    name:{type:String, required:[true, "Merchant name is required"], minlength:3},
    user_id={type:String, required:true},
    description:{type:String, required:[true, "Description is required"]},
    products:[ProductSchema],
})
mongoose.model('Merchant', MerchantSchema)
var Merchant = mongoose.model('Merchant');

var ProductSchema=new mongoose.Schema({
    
})




app.use(express.static(path.join(__dirname, './public/dist/public')))

app.get('/getFeatured', function(request, response){
    console.log("Recieved function request")
    var ref=db.collection("products")
    ref.where("bigBanner", "==", false).get().then(snapshot=>{
        // console.log(snapshot)
        // response.json({'bigBanners':snapshot})
        snapshot.forEach(doc=>{
            console.log(doc.id, ':', doc.data())
        })
    })
})

app.all('*', (request, response, next)=>{
    response.sendFile(path.resolve('./public/dist/public/index.html'))
})

app.listen(8000, function(){
    console.log("Server is listening on port 8000")
})
