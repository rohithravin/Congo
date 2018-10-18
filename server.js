var express=require('express')
var app=express()
var path=require('path')
var mongoose=require('mongoose')
var bodyParser=require('body-parser')
var bcrypt=require('bcryptjs')
var NUM_SALTS=10
app.set('trust proxy', 1)
var session=require('express-session')({
    secret:'CongoIs!For!Everyone9923',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:60000}
})

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
    // cart:"CartSchema"
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
    reviews:["ReviewSchema"],
    category:{type:String /*, required:[false, "Category is required"]*/}
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
}, {timestamps:true})
mongoose.model('Review', ReviewSchema)
var Review=mongoose.model('Review')

var CartItemSchema = new mongoose.Schema({
    product:ProductSchema,
    size:{type:String, required:[true, "Size is required"]},
    color:{type:String, required:[true, "Color is required"]},
    quantity:{type:Number, min:1, required:true}
}, {timestamps:true})
mongoose.model('CartItem', CartItemSchema)
var CartItem=mongoose.model('CartItem')

var CartSchema = new mongoose.Schema({
    // user:UserSchema,
    userID:{type:String, required:true},
    items:[CartItemSchema],
    // total:{type:Number, default:0}
}, {timestamps:true})
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
}, {timestamps:true})
mongoose.model('Order', OrderSchema)
var Order=mongoose.model('Order')

app.use(express.static(path.join(__dirname, './public/dist/public')))
app.use(bodyParser.json())

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

app.get('/getProduct/:productID', function(request, response){
    var productID=request.params.productID
    console.log("Recieved getProduct request")
    console.log(productID)
    Product.findOne({_id:productID}, function(error, product){
        if(error){
            response.json({success:-1, message:'Server Error'})
        }
        else{
            if(product==null){
                response.json({success:0, message:"Product does not exist"})
            }
            else{
                response.json({success:1, message:"Successfully found product", product:product})
            }
        }
    })
})


app.post('/fetchSearchedProducts', function(request, response){
    var searchQuery=request.body['searchQuery']
    console.log(searchQuery)
    var queryRegex= new RegExp(searchQuery, 'i')
    Product.find({$or:[{name: {$regex: queryRegex}}, {description: {$regex: queryRegex}}, {tags: {$regex: queryRegex}}]}, function(error, products){
        if(error){
            response.json({success:0, message:"There was an error"})
        }
        else{
            response.json({success:1, message:"Successfully fetched products", products:products})
        }
    })
})


app.post('/processLoginMerchant', function(request, response){
  var license=request.body['license']
  var password=request.body['password']
  console.log("we made it " + license);
})

app.post('/processLogin', function(request, response){
    // if('loggedIn' in request.session && request.session.loggedIn==true){
    //     return response.json({success:0, message:"User already logged in"})
    // }
    var email=request.body['email']
    var password=request.body['password']
    var hashedPW=bcrypt.hashSync(password, NUM_SALTS)
    User.findOne({email:email}, function(error, user){
        if(error){
            response.json({success:-1, message:'Server Error'})
        }
        else{
            if(user==null){
                response.json({success:0, message:"Invalid login"})
            }
            else{
                if(bcrypt.compareSync(password, user.password)){
                    //Add stuff to session if express session
                    // request.session.userID=user._id
                    // request.session.loggedIn=true
                    response.json({success:1, message:"Login successful", userID:user._id, first_name:user.first_name})
                }
                else{
                    response.json({success:0, message:"Invalid Login"})
                }
            }
        }
    })
})

app.post('/processMerchantRegistration', function(request, response){
  console.log("here");
    var url  = request.body['url'];
    console.log(url);
})


app.post('/processRegister', function(request, response){
    var first_name=request.body['first_name']
    var last_name=request.body['last_name']
    var password=request.body['password']
    var email=request.body['email']
    var phone_number=request.body['phone_num']
    User.findOne({email:email}, function(error, user){
        if(error){
            response.json({success:-1, message:"Server error"})
        }
        else{
            if(user!=null){
                response.json({success:0, message:"A user already exists with this email"})
            }
            else{
                var hashedPW=bcrypt.hashSync(password, NUM_SALTS)
                var newUser=new User({first_name:first_name, last_name:last_name, email:email, password:hashedPW, phone_number:phone_number})
                newUser.save(function(error){
                    if(error){
                        response.json({success:0, message:'There was an error registering. Check your input again'})
                    }
                    else{
                        response.json({success:1, message:"Successfully registered!", user:newUser})
                    }
                })
            }
        }
    })
})

app.post('/createDummyProduct', function(request, response){
    // if(!('loggedIn' in request.session) || ('loggedIn' in request.session && request.session.loggedIn==false)){
    //     return response.json({success:0, message:'User not logged in'})
    // }
    // console.log("Doing this for the change")
    var product=request.body['product']
    console.log(product)
    var newProduct=new Product({name:product.name, price:parseFloat(product.price), description:product.description, sizes:[product.size], colors:[product.color], images:[product.image], tags:[product.tag]})
    newProduct.save(function(error){
        console.log("Inside save function")
        if(error){
            response.json({success:0, message:"There was an error creating your product"})
        }
        else{
            response.json({success:1, message:"Successfully created the product!", product:newProduct})
        }
    })
})

app.post('/processAddToCart', function(request, response){
    // var cartProduct=request.body['details']
    var userID=request.body['userID']
    var newCartItem=new CartItem(request.body['details'])
    newCartItem.save(function(error){
        if(error){
            response.json({success:0, message:"Unable to add to Cart", error:error})
        }
        else{
            //Created new Cart Product
            User.findOne({_id: userID}, function(findUserErr, user){
                if(findUserErr){
                    response.json({success:0, message:"Unable to find User"})
                }
                else{
                    //Found user whose cart to add to
                    //Now check if cart exists
                    Cart.findOneAndUpdate({userID: user._id}, {$push:{items: newCartItem}}, function(error, cart){
                        if(error){
                            response.json({success:-1, message:"Server error"})
                        }
                        else{
                            if(cart!=null){
                                response.json({success:1, message:"Successfully added to an old cart", cart:cart})
                            }
                            else{
                                //Cart doesn't exist, create cart then add to it
                                var newCart=new Cart({userID: user._id, items:[newCartItem], total:newCartItem.product.price})
                                newCart.save(function(error){
                                    if(error){
                                        response.json({success:0, message:"Failed when creating a new cart for this user"})
                                    }
                                    else{
                                        response.json({success:1, message:"Successfully added to new cart", cart:newCart})
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
})

app.post('/getCart', function(request, response){
    console.log(request)
    var userID=request.body['userID']
    console.log(request.body['doubleCheck'])
    // console.log(request['details'])
    // var userID='12893129ansd'
    console.log(userID)
    Cart.findOne({userID:userID}, function(error, cart){
        if(error){
            response.json({success:0, response:'Cart does not exist'})
        }
        else{
            response.json({success:1, response:"Successfully found your cart", cart:cart})
        }
    })
})

app.all('*', (request, response, next)=>{
    response.sendFile(path.resolve('./public/dist/public/index.html'))
})

app.listen(8000, function(){
    console.log("Server is listening on port 8000")
})
