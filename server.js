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
    name:{type:String, required:[true, "Merchant name is required"], minlength:5},
    email:{type:String, required:[true, "Email is required"]},
    url:{type:String, required:[true, "URL is required"], minlength:10},
    // user:UserSchema,
    userID:{type:String, required:[true, "UserID is required"]},
    description:{type:String, required:[true, "Description is required"]},
    products:["ProductSchema"],
    bankAccountNumber:{type:String, required:[true, "Bank account is required"]},
    routingNumber:{type:String, required:[true, "Routing number is required"]},
    creditCardNum:{type:String, required:[true, "Credit card number is required"]},
    creditCardExp_month:{type:String, required:[true, "Expiration month is required"]},
    creditCardExp_year:{type:String, required:[true, "Expiration year is required"]},
    creditCard_CVV:{type:String, required:[true, "CVV is required"]},
    license:{type:String},
    approved:{type:Boolean, default:false}
}, {timestamps:true})
mongoose.model('Merchant', MerchantSchema)
var Merchant = mongoose.model('Merchant');

var ReviewSchema= new mongoose.Schema({
    userID:{type:String, required:[true, "userID is required."]},
    rating:{type:Number, required:true, min:1, max:5},
    review:{type:String, required:[true, "A review is required"], minlength:20},
    productID:{type:String, required:[true, "ProductID is required"]}
}, {timestamps:true})
mongoose.model('Review', ReviewSchema)
var Review=mongoose.model('Review')

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
    active:{type:Boolean, default:true},
    // merchant:MerchantSchema,
    merchantLicense:{type:String},
    reviews:[ReviewSchema],
    category:{type:String /*, required:[false, "Category is required"]*/},
    promoted:{type:Boolean, default:false},
    promotionType:{type:String},
    endDate:{type:Date},
    promotionImage:{type:String}
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

var OrderItemSchema=new mongoose.Schema({
    product:ProductSchema,
    size:{type:String, required:[true, "Size is required"]},
    color:{type:String, required:[true, "Color is required"]},
    quantity:{type:Number, min:1, required:true},
    total:{type:Number, default:0},
    orderID:{type:String}
}, {timestamps:true})
mongoose.model('OrderItem', OrderItemSchema)
var OrderItem=mongoose.model('OrderItem')

var OrderSchema=new mongoose.Schema({
    total:{type:Number, required:[true, "Total is required"]},
    shipping:{type:Number, default:0},
    userID:{type:String, required:[true, 'User ID is required']},
    stripe_key:{type:String/*, required:true*/},
    //Change ProductSchema to orderItemSchema and in cart schema, create cart item
    items:[OrderItemSchema],
    refunded:{type:Boolean, default:false},
    street_address:{type:String, required:[true, "Street address is required"]},
    city:{type:String, required:[true, "Street address is required"]},
    state:{type:String, required:[true, "State is required"]},
    zip_code:{type:String, required:[true, "Zip Code is required"]},
    country:{type:String, default:'United States'},
    tempID:{type:String},
    items:{type:Number, default:0, required:[true, "Number of items is required"]}
}, {timestamps:true})
mongoose.model('Order', OrderSchema)
var Order=mongoose.model('Order')

app.use(express.static(path.join(__dirname, './public/dist/public')))
app.use(bodyParser.json())

app.get('/getFeaturedFirebase', function(request, response){
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

app.post('/fetchSearchedProductsWithCategory', function(request, response){
    var searchQuery=request.body['searchQuery']
    var category=request.body['category']
    var queryRegex= new RegExp(searchQuery, 'i')
    Product.find({$and:[{$or:[{name: {$regex: queryRegex}}, {description: {$regex: queryRegex}}, {tags: {$regex: queryRegex}}]},{category:category}]}, function(error, products){
        if(error){
            response.json({success:0, message:"There was an error"})
        }
        else{
            response.json({success:1, message:"Successfully fetched products", products:products})
        }
    })
})


app.post('/fetchSearchedProducts', function(request, response){
    var searchQuery=request.body['searchQuery']
    console.log(searchQuery)
    var queryRegex= new RegExp(searchQuery, 'i')
    Product.find({$and:[{$or:[{name: {$regex: queryRegex}}, {description: {$regex: queryRegex}}, {tags: {$regex: queryRegex}}]},{active:true}]}, function(error, products){
        if(error){
            response.json({success:0, message:"There was an error"})
        }
        else{
            response.json({success:1, message:"Successfully fetched products", products:products})
        }
    })
})

app.post('/fetchSearchedProductsWithCategory', function(request, response){
    var searchQuery=request.body['searchQuery']
    var category=request.body['category']
    var queryRegex= new RegExp(searchQuery, 'i')
    Product.find({$and:[{$or:[{name: {$regex: queryRegex}}, {description: {$regex: queryRegex}}, {tags: {$regex: queryRegex}}]},{category:category}, {active:true}]}, function(error, products){
        if(error){
            response.json({success:0, message:"There was an error"})
        }
        else{
            response.json({success:1, message:"Successfully fetched products", products:products})
        }
    })
})


app.post('/processMerchantLogin', function(request, response){

  var license=request.body['license']
  var password=request.body['password']
//   console.log('License:', license, 'Password:', password)
//   var hashedhPW=bcrypt.hashSync(password, NUM_SALTS)
  Merchant.findOne({license:license}, function(error, merchant){
    if(error){
        response.json({success:0, message:'Invalid credentials'})
    }
    else if(merchant==null){
        response.json({success:0, message:'Invalid credentials'})
    }
    else{
        //Found merchant
        User.findOne({_id:merchant.userID}, function(error, user){
            if(error){
                response.json({success:-1, message:'Server error'})
            }
            else if(user==null){
                response.json({success:-1, message:'Server error'})
            }
            else{
                //found user
                if(bcrypt.compareSync(password, user.password)){
                    response.json({success:1, message:'Login successful', name:merchant.name})
                }
                else{
                    response.json({success:0, message:'Invalid credentials'})
                }
            }
        })
    }
  })
})

app.post('/processLogin', function(request, response){
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
                    response.json({success:1, message:"Login successful", userID:user._id, first_name:user.first_name})
                }
                else{
                    response.json({success:0, message:"Invalid Login"})
                }
            }
        }
    })
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
    var license=request.body['license']
    Merchant.findOne({license:license}, function(error, merchant){
        if(error){
            response.json({success:-1, message:"There was an error"})
        }
        else if(merchant==null){
            response.json({success:-1, message:"There was an error"})
        }
        else{
            console.log(product)
            var newProduct=new Product({name:product.name, price:parseFloat(product.price), description:product.description, sizes:product.size, colors:product.color, images:[product.image], tags:product.tag, merchantLicense:license, category:product.category})
            newProduct.save(function(error){
                console.log("Inside save function")
                if(error){
                    response.json({success:0, message:"There was an error creating your product"})
                }
                else{
                    merchant.products.push(newProduct)
                    merchant.save(function(error){
                        if(error){
                            response.json({success:0, message:"There was an error saving product to merchant"})
                        }
                        else{
                            response.json({success:1, message:"Successfully created the product!", product:newProduct})
                        }
                    })
                    // response.json({success:1, message:"Successfully created the product!", product:newProduct})
                }
            })
        }
    })
})

app.post('/changeProductActiveState', function(request, response){
    var productID=request.body['productID']
    // var userID=request.body['userID']
    var license=request.body['license']
    Product.findOne({_id:productID}, function(error, product){
        if(error){
            return response.json({success:-1, message:'Server Error'})
        }
        else if(product==null){
            return response.json({success:0, message:'Unable to find product'})
        }
        else{
            //Successfully found product
            if(product.merchantLicense!=license){
                return response.json({success:0, message:'This is not your product'})
            }
            else{
                product.active=!product.active
                product.save(function(error){
                    if(error){
                        return response.json({success:0, message:'Unable to save product'})
                    }
                    else{
                        return response.json({success:1, message:'Successfully changed product state', product:product})
                    }
                })
            }
        }
    })
})

app.post('/processAddToCart', function(request, response){
    // var cartProduct=request.body['details']
    var userID=request.body['userID']
    var newCartItem=new CartItem(request.body['details'])
    if(newCartItem.product.active==false){
        return response.json({success:-1, message:'This product is inactived'})
    }
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
                                // Cart doesn't exist, create cart then add to it
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
    var userID=request.body['userID']
    Cart.findOne({userID:userID}, function(error, cart){
        if(error){
            response.json({success:-1, response:'Server error'})
        }
        //Change this to create new cart if cart is null
        else if(cart==null){
            response.json({success:0, response:'Cart does not exist'})
        }
        else{
            response.json({success:1, response:"Successfully found your cart", cart:cart})
        }
    })
})

app.post('/checkMerchantReg', function(request, response){
    var merchantName=request.body['name']
    var merchantURL=request.body['url']
    foundError=false;
    Merchant.findOne({name:merchantName}, function(error, merchant){
        if(!error){
            foundError=true;
            return response.json({success:-1, response:'Merchant with that name already exists'})
        }
    })
    if(foundError==false){
        Merchant.findOne({url:merchantURL}, function(error, merchant){
            if(!error){
                foundError=true;
                return response.json({success:-2, response:'URL is already being used for another merchant'})
            }
        })
    }
    if(foundError==false){
        return response.json({success:1, response:'No merchant exists yet with this info.'})
    }
})

app.post('/processMerchantRegistration', function(request, response){
    // console.log(request.body)
    // response.json({success:1, message:'This is just a test'})
    if(!('userID' in request.body)){
        return response.json({success:0, message:'No user ID provided'})
    }
    else if(request.body['userID']==null){
        return response.json({success:0, message:'No user ID provided'})
    }
    var info=request.body['info']
    console.log('Info:',info);
    var userID=request.body['userID']
    console.log('UserID:',userID)
    User.findOne({_id: userID}, function(error, user){
        if(error){
            return response.json({success:0, message:"Could not find a user with request id"})
        }
        else{
            // info['user']=user
            // return response.json({success:1, message:'Successfully found user'})
            Merchant.find({$or:[{name:info['name']}, {url:info['url']}]}, function(error, merchants){
                if(error){
                    response.json({success:-2, message:'Server error'})
                }
                else{
                    if(merchants.length!=0){
                        response.json({success:-3, message:'Merchant already exists with this info'})
                    }
                    else{
                        var license=createHash(info['name'], info['url'])
                        var newMerchant = new Merchant({url:info['url'], email:info['email'], description:info['description'], name:info['name'], routingNumber:info['routingNumber'], bankAccountNumber:info['bankAccountNumber'], creditCardNum:info['creditCardNum'], creditCardExp_month:info['creditCardExp_month'], creditCardExp_year:info['creditCardExp_year'], creditCard_CVV:info['creditCard_CVV'], userID:userID, license:license})
                        newMerchant.save(function(error){
                            if(error){
                                response.json({success:-1, message:'Could not create merchant', error:error})
                            }
                            else{
                                response.json({success:1, message:'Successfully registered!', license:license})
                            }
                        })
                    }
                }
            })
        }
    })
})

app.post('/promoteProduct', function(request, response){
    console.log(request.body)
    var productID=request.body['productID']
    // var userID=request.body['userID']
    var license=request.body['license']
    var promotionType=request.body['promotionType']
    var endDate=request.body['endDate']
    var promotionImage=request.body['promotionImage']
    Product.findOne({_id:productID}, function(error, product){
        if(error){
            return response.json({success:0, message:'Could not find product'})
        }
        else{
            //Product id is valid
            // if(product.merchant.license!=license){
            if(product.merchantLicense!=license){
                return response.json({success:-1, message:'This product does not belong to this merchant'})
            }
            if(product.promoted==true){
                return response.json({success:-2, message:'This product is already being promoted'})
            }
            if(promotionType=="Big Banner"){
                product.promotionType="BB"
            }
            else if(promotionType=="Small Banner"){
                product.promotionType="SB"
            }
            else if(promotionType=="Featured Product"){
                product.promotionType="FP"
            }
            else{
                return response.json({success:-4, message:'Promotion Type Invalid'})
            }
            product.endDate=endDate
            if(promotionImage!='false@IOnoa99okaXXa67'){
                product.promotionImage=promotionImage
            }
            product.promoted = true;
            product.save(function(error){
                if(error){
                    return response.json({success:-3, message:'Unable to save product, check your inputs'})
                }
                else{
                    return response.json({success:1, message:'Successfully promoted product'})
                }
            })
        }
    })
})
app.post('/fetchMerchantProducts', function(request, response){
    var license=request.body['license']
    // Product.find({merchant['license']:license})
    Product.find({merchantLicense:license}, function(error, products){
        if(error){
            response.json({success:-1, message:'Server error'})
        }
        else{
            response.json({success:1, message:"Successfully fetched your products", products:products})
        }
    })
})

app.post('/removeProductFromCart', function(request,response){
    console.log("remove product from cart");
    if(!('productID' in request.body)){
        return response.json({success:-1, message:"Product ID not in body"})
    }
    console.log(request.body['productID'])
    var userID=request.body['userID']


    User.findOne({_id: userID}, function(findUserError,results){
        if(findUserError){
           return response.json({success:0, message:"Unable to find user"})
        }
        else{
            //found user
            Cart.findOne({userID:userID}, function(error,cart){
                if(error){
                   return response.json({success:0, response:'Cart does not exist'})
                }
                if(cart){
                    for (var i = 0; i < cart['items'].length; i++){
                        if(cart['items'][i]['_id'] == request.body['productID']){
                            cart['items'].splice(i,1);
                            cart.save(function(error){
                                if(error){
                                   return response.json({success:0, message:"Failed when removing from cart for this user"})
                                }
                                else{
                                  return  response.json({success:1, message:"Successfully removed from cart"})
                                }
                            })
                        }
                    }
                }
            })
        }
    })
})

app.post('/processEdit', function(request, response){
    if(!('productID' in request.body)){
        return response.json({success:-1, message:"Product ID not in body"})
    }
    var oldProduct=request.body['product']
    Product.findOne({_id:request.body['productID']}, function(error, product){
        if(error){
            response.json({success:-1, message:"Server error"})
        }
        else if(product==null){
            response.json({success:0, message:'Invalid product id'})
        }
        else{
            //found product
            if(!('license' in request.body)){
                return response.json({success:-1, message:'License in not request'})
            }
            console.log("License: ", request.body['license'])
            console.log("Product License:", product.merchantLicense)
            if(product.merchantLicense!=request.body['license']){
                return response.json({success:0, message:'Licenses do not match'})
            }

            product.name=oldProduct.name
            product.price=parseFloat(oldProduct.price)
            product.description=oldProduct.description
            product.sizes=oldProduct.size
            product.colors=oldProduct.color
            product.tags=oldProduct.tag
            product.category=oldProduct.category

            product.save(function(error){
                if(error){
                    response.json({success:0, message:'Could not make these changes'})
                }
                else{
                    response.json({success:1, message:'Successfully edited product', product:product})
                }
            })
        }
    })
})

app.post('/createOrder', function(request, response){
    if(!('userID' in request.body)){
        return response.json({success:-1, message:'UserID not in request.body'})
    }
    User.findOne({_id:request.body['userID']}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user exists with this id'})
        }
        else{
            Cart.findOne({userID:request.body['userID']},async function(error, cart){
                if(error){
                    return response.json({success:-1, message:'Server error'})
                }
                else if(cart==null){
                    return response.json({success:0, message:'No Cart yet exists for this user'})
                }
                var street=request.body['street']
                var city=request.body['city']
                var state=request.body['state']
                var zip_code=request.body['zip']
                var shipping=request.body['shipping']
                var tax=request.body['tax']
                var tempID=createTempID()
                var currentTotal=0;
                console.log("tempID:", tempID)
                var items=[]
                for(var i=0; i<cart.items.length; i++){
                    var item=cart.items[i]
                    var thisItem={}
                    thisItem.product=item.product
                    thisItem.size=item.size
                    thisItem.color=item.color
                    thisItem.quantity=item.quantity
                    thisItem.total=item.product.price * item.quantity
                    currentTotal+=parseFloat(thisItem.total)
                    items.push(thisItem)
                }
                var newOrder = new Order({userID:request.body['userID'], street_address:street, city:city, state:state, zip_code:zip_code, country:'United States', shipping:parseFloat(shipping), tempID:tempID, total:0, items:items.length})

                currentTotal=currentTotal+parseFloat(shipping)+parseFloat(tax);
                newOrder.total=currentTotal
                newOrder.save(function(error){
                    if(error){
                        return response.json({success:0, message:"Unable to create order"})
                    }
                    else{
                        Order.findOne({tempID:tempID}, function(error, order){
                            if(error){
                                return response.json({success:-1, message:'Unable to find order to add items'})
                            }
                            else{
                                var j;
                                for(j=0; j<items.length; j++){
                                    var item=items[j]
                                    item.orderID=order._id
                                    var newOrderItem = new OrderItem(item)
                                    newOrderItem.save(function(error){
                                        if(error){
                                            console.log("Unable to save a product")
                                            return response.json({success:0, message:'Unable to save'})
                                        }
                                    })
                                }
                                if(j==items.length){
                                    Cart.deleteOne({userID:request.body['userID']}, function(error){
                                        if(error){
                                            return response.json({success:0, message:'There was an error deleting the Cart'})
                                        }
                                        else{
                                            return response.json({success:1, message:'Successfully created Order'})
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            })
        }
    })
})

app.post('/getUserOrders', function(request, response){
    if(!('userID' in request.body)){
        return response.json({success:-1, message:'userID not in request.body'})
    }
    User.findOne({_id:request.body['userID']}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server Error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user found with this ID'})
        }
        else{
            Order.find({userID:user._id}, function(error, orders){
                if(error){
                    return response.json({success:-1, message:'Server Error'})
                }
                else{
                    return response.json({success:1, message:'Found your orders', orders:orders})
                }
            })
        }
    })
})

app.post('/getOrderItems', function(request, response){
    if(!('userID' in request.body)){
        return response.json({success:-1, message:'userID not in request.body'})
    }
    if(!('orderID' in request.body)){
        return response.json({success:-1, message:'orderID not in request.body'})
    }
    User.findOne({_id:request.body['userID']}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server Error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user found with this ID'})
        }
        else{
            Order.findOne({_id:request.body['orderID']}, function(error, order){
                if(error){
                    return response.json({success:-1, message:'Server Error'})
                }
                else if(order==null){
                    return response.json({success:0, message:'No order found with this ID'})
                }
                else{
                    if(order.userID!=request.body['userID']){
                        return response.json({success:0, message:'This is not your product'})
                    }
                    else{
                        OrderItems.find({orderID:order._id}, function(error, items){
                            if(error){
                                return response.json({success:-1, message:'Server Error'})
                            }
                            else{
                                return response.json({success:1, message:'Successfully fetched order items', items:items})
                            }
                        })
                    }
                }
            })
        }
    })
})

app.get('/testHash', function(request, response){
    var license=createHash('MichaelChoiComp', 'www.google.com')
    console.log(license)
    response.json({license:license})
})

app.get('/getFeatured', function(request, response){
    var bigBannerProducts = [];
    var smallBannerProducts = [];
    var featuredProducts = [];

    Product.find({promotionType:'BB'}, function(error, products){
        if(error){
           return response.json({success:-1, message:'Server error'})
        }
        else{
            //Fetch 5 random indeces of products
            //Append to big banner products
            var _numProducts = 5;
            var _pickedIndexes = [];
            for(var i=0;i<products.length;i++){_pickedIndexes[i]=0;}
            if (products.length != 0) {
                for (var i = 0; i < _numProducts; i++) {
                    do {
                        var randIndex = Math.floor(Math.random() * (products.length));
                    } while (_pickedIndexes[randIndex] != 0) {
                        _pickedIndexes[randIndex] = 1;
                        bigBannerProducts[i] = products[randIndex];
                    }
                }
            }
        }
    })
    Product.find({promotionType:'SB'}, function(error, products){
        if(error){
           return response.json({success:-1, message:'Server error'});
        }
        else{
            //Get 2 random indeces, make sure no repeats
            //Append to small Banner products
            var _numProducts = 2;
            var _pickedIndexes = [];
            if (products.length != 0){
                for(var i=0;i<products.length;i++){_pickedIndexes[i]=0;}
                for(var i =0; i < _numProducts; i++){
                    do{
                        var randIndex = Math.floor(Math.random() * (products.length));
                    } while (_pickedIndexes[randIndex] != 0) {
                        _pickedIndexes[randIndex] = 1;
                        smallBannerProducts[i] = products[randIndex];
                    }
                }
            }
        }
    })
    Product.find({promotionType:'FP'}, function(error,products){
        if(error){
          return  response.json({success:-1, message:'Server error'});

        }
        else{
            //get 6 random indeces, make sure no repeats
            //append to featured products
            var _numProducts = 6;
            var _pickedIndexes = [];
            if (products.length != 0) {
                for (var i = 0; i < products.length; i++) { _pickedIndexes[i] = 0; }
                for (var i = 0; i < _numProducts; i++) {
                    do {
                        var randIndex = Math.floor(Math.random() * (products.length));
                    } while (_pickedIndexes[randIndex] != 0) {
                        _pickedIndexes[randIndex] = 1;
                        featuredProducts[i] = products[randIndex];
                    }
                }
            }
          return response.json({success: 1, message: "Successfully fetched all featured products", bigBanner: bigBannerProducts, smallBanner: smallBannerProducts, featuredProducts: featuredProducts});
        }
    })
})

app.post('/processNewReview', function(request, response){
    //ProductID, userID, rating, review
    var productID=request.body['productID']
    var userID=request.body['userID']
    var rating=request.body['rating']
    var review=request.body['review']

    User.findOne({_id:userID}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user exists with this ID'})
        }
        else{
            //Found user
            var newReview = new Review({userID:userID, rating:rating, review:review, productID:productID})
            newReview.save(function(error){
                if(error){
                    return response.json({success:0, message:'Unable to create review'})
                }
                else{
                    //successfully created newReview
                    Product.findOneAndUpdate({_id:productID}, {$push: {reviews:newReview}}, function(error, product){
                        if(error){
                            return response.json({success:-1, message:'Unable to push review to this product'})
                        }
                        else if(product==null){
                            return response.json({success:0, message:'Unable to find product'})
                        }
                        else{
                            //Found product and successfully pushed new review
                            return response.json({success:1, messsage:'Successfully placed review', review:newReview})
                        }
                    })
                }
            })
        }
    })
})

app.all('*', (request, response, next)=>{
    response.sendFile(path.resolve('./public/dist/public/index.html'))
})


app.listen(8000, function(){
    console.log("Server is listening on port 8000")
})

function createTempID(){
    var hashed=''
    for(var i=0; i<12; i++){
        var numberOrLetter=Math.floor(Math.random()*3+1)
        if(numberOrLetter==3){
            var toAdd=Math.floor(Math.random()*9)
            toAdd+=48
            hashed+=String.fromCharCode(toAdd)
        }
        else{
            if(numberOrLetter==2){
                var toAdd=String.fromCharCode(Math.floor(Math.random()*26+65))
                hashed+=toAdd
                //Random lowerCase letter
            }
            else{
                var toAdd=String.fromCharCode(Math.floor(Math.random()*26+97))
                hashed+=toAdd
                //Random upperCase letter
            }
        }
    }
    return hashed
}

function createHash(name, url){
    var hashed=''
    for(var i=1; i<name.length-1; i+=2){
        var numberOrLetter=Math.floor(Math.random()*3+1)
        if(numberOrLetter==3){
            var toAdd=Math.floor(Math.random()*9)
            toAdd+=48
            hashed+=String.fromCharCode(toAdd)
        }
        else{
            var currentChar=name[i].charCodeAt(0)
            var upperLower=Math.floor(Math.random()*2+1)
            currentChar=(((currentChar+62)*27-52)*3)%26
            if(upperLower==1){
                currentChar+=65
            }
            else if(upperLower==2){
                currentChar+=97
            }
            hashed+=String.fromCharCode(currentChar)
        }
    }
    for(var i=0; i<url.length-1; i+=2){
        var numberOrLetter=Math.floor(Math.random()*3+1)
        if(numberOrLetter==3){
            var toAdd=Math.floor(Math.random()*9)
            toAdd+=48
            hashed+=String.fromCharCode(toAdd)
        }
        else{
            var currentChar=url[i].charCodeAt(0)
            var upperLower=Math.floor(Math.random()*2+1)
            currentChar=(((currentChar+62)*27-52)*3)%26
            if(upperLower==1){
                currentChar+=65
            }
            else if(upperLower==2){
                currentChar+=97
            }
            hashed+=String.fromCharCode(currentChar)
        }
    }
    //Check db to see if license exists, if it does, replace the website with the hashed String and make a recursive return call to this hash Function
    return hashed
}
