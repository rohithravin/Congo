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
    user:UserSchema,
    description:{type:String, required:[true, "Description is required"]},
    products:["ProductSchema"],
}, {timestamps:true})
mongoose.model('Merchant', MerchantSchema)
var Merchant = mongoose.model('Merchant');

var ProductSchema=new mongoose.Schema({
    name:{type:String, required:[true, "Product name is required"], minlength:5},
    price:{type:Number, required:[true, "Price is required"], min:0},
    description:{type:String, required:[true, "Description is required"], minlength:10},
    sizes:[{type:String}],
    colors:[{type:String}],
    num_sold:{type:Number, default:0},
    num_views:{type:Number, default:0},
    images:[{type:String}],
    tags:[{type:String}],
    merchant:MerchantSchema,
    reviews:["ReviewSchema"]
}, {timestamps:true})
mongoose.model('Product', ProductSchema)
var Product=mongoose.model('Product')

var BigBannerSchema=new mongoose.Schema({
    image:{type:String, required:[true, "Image is required"]},
    active:{type:Boolean, default:true},
    product:ProductSchema
}, {timestamps:true})
mongoose.model('BigBanner', BigBannerSchema)
var BigBanner=mongoose.model('BigBanner')

var ReviewSchema= new mongoose.Schema({
    user:UserSchema,
    product:ProductSchema,
    rating:{type:Number, required:true, min:1, max:5},
    review:{type:String, required:[true, "A review is required"], minlength:20}
})
mongoose.model('Review', ReviewSchema)
var Review=mongoose.model('Review')

var CartSchema = new mongoose.Schema({
    user:UserSchema,
    items:[ProductSchema],
    total:{type:Number, default:0}
})
mongoose.model('Cart', CartSchema)
var Cart=mongoose.model('Cart')

var OrderSchema=new mongoose.Schema({
    total:{type:Number, default:0},
    shipping:{type:Number, default:0},
    user:UserSchema,
    stripe_key:{type:String, required:true},
    //Change ProductSchema to orderItemSchema and in cart schema, create cart item
    items:[ProductSchema],
    refunded:{type:Boolean, default:false},
    street_address:{type:String, required:[true, "Street address is required"]},
    city:{type:String, required:[true, "Street address is required"]},
    state:{type:String, required:[true, "State is required"]},
    zip_code:{type:String, required:[true, "Zip Code is required"]},
    country:{type:String, default:'United States'}
})
mongoose.model('Order', OrderSchema)
var Order=mongoose.model('Order')

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
