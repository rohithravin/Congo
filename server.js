var express=require('express')
var app=express()
var path=require('path')
var mongoose=require('mongoose')
var bodyParser=require('body-parser')
var bcrypt=require('bcryptjs')
var stripe = require("stripe")("sk_test_tcsBLV9DqJd2ygWV1Mppca6g")
var key_publish="pk_test_lFRUSGrB96hXbSFpTUVDxzJ3"
var Base64 = require('js-base64').Base64;
//Added gmail


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

var SiteSchema= new mongoose.Schema({
    visits:{type:Number, default:0}
})
mongoose.model('Site', SiteSchema)
var Site=mongoose.model('Site')

var UserSchema = new mongoose.Schema({
    first_name:{type:String, required:[true, "First name is required."], minlength:2},
    last_name:{type:String, required:[true, "Last name is required"], minlength:2},
    email:{type:String, required: [true, "Email is required"], minlength:5},
    password:{type:String, required:[true, "Password is required"], minlength:[8, "Password must be atleast 8 characters"]},
    user_level:{type:Number, default:1},
    phone_number:{type:String, required:[true, "Phone number is required"], minlength:[10, "Invalid phone number"], maxlength:[10, "Invalid phone number"]},
    stream:{type:Boolean, default:false, required:[true, "Stream is required"]},
    pin:{type:String, length:4},
    credits:{type:Number, default:0, min:0},
    history:["ProductSchema"]
    // cart:"CartSchema"
}, {timestamps:true});
mongoose.model('User', UserSchema)
var User = mongoose.model('User')

var MerchantSchema = new mongoose.Schema({
    name:{type:String, required:[true, "Merchant name is required"], minlength:5},
    email:{type:String, required:[true, "Email is required"]},
    url:{type:String, required:[true, "URL is required"], minlength:10},
    // user:UserSchema,
    userID:{type:String, /*required:[true, "UserID is required"]*/},
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
    first_name:{type:String},
    last_name:{type:String},
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
    // num_views:{type:Number, default:0},
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
    rating:{type:Number, default:5},
    promotionImage:{type:String},
    views:{type:Number, default:0, min:0}
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
    orderID:{type:String},
    shipped:{type:Boolean, default:false},
    merchantLicense:{type:String},
    street_address:{type:String},
    city:{type:String},
    state:{type:String},
    zip_code:{type:String},
    country:{type:String, default:"United States"},
    name:{type:String}
}, {timestamps:true})
mongoose.model('OrderItem', OrderItemSchema)
var OrderItem=mongoose.model('OrderItem')

var OrderSchema=new mongoose.Schema({
    total:{type:Number, required:[true, "Total is required"]},
    shipping:{type:Number, default:0},
    userID:{type:String, required:[true, 'User ID is required']},
    stripe_key:{type:String/*, required:true*/},
    //Change ProductSchema to orderItemSchema and in cart schema, create cart item
    // items:[OrderItemSchema],
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

var GiftCardSchema=new mongoose.Schema({
    buyerID:{type:String, required:[true, "buyerID is required"]},
    cardNumber:{type:String, required:[true, "Card Number is required"]},
    value:{type:Number, required:[true, "Value is required for gift cards"], min:0},
    active:{type:Boolean, default:true, required:[true, "Card active status is required"]}
})
mongoose.model('GiftCard', GiftCardSchema)
var GiftCard=mongoose.model('GiftCard')

app.use(express.static(path.join(__dirname, './public/dist/public')))
app.use(bodyParser.json())

/*
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
*/

//NODE MAILER CODE START

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

//END OF NODEMAILER CODE

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
                Merchant.findOne({license:product.merchantLicense},function(error,merchant){
                    if(error){
                        return response.json({success:0,message:'server error'});
                    }else{
                        
                        if(merchant != null){
                            response.json({success:1, message:"Successfully found product", product:product,merchantName:merchant.name})
                        }else{
                            response.json({success:1, message:"Successfully found product", product:product,merchantName:'Congo Merchant'})
                        }
                        
                    }
                })
                
            }
        }
    })
})

app.post('/recommendedListRaw', function(request, response){
    var category=request.body['category']
    var tag=request.body['tag']
    Product.find({$or:[{category:category}, {tag:tag}]}, function(error, products){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
            return response.json({success:1, message:'Successfully fetched products that match this category and tag', products:products, category:category, tag:tag})
        }
    })
})

app.post('/updateProductSold',function(request,response){
    var productID=request.body['productID'];
    console.log("prod id: ",productID);
    Product.findOne({_id:productID},function(error,product){
        if(error){
            return response.json({success:0,message:'Server Error'});
        }else{
            if(product==null){
                return response.json({success:0,message:'Product does not exist'});
            }else{
                //change the ish
                product.num_sold = (product.num_sold + 1);
                product.save(function(error){
                    if(error){
                        return response.json({succes:0,message:'Cant save product'});
                    }else{
                        return response.json({success:1,message:'Product bought updated'});
                    }
                })
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

app.post('/processStreamRegistration', function(request,response){
    var userID = request.body['userID'];
    console.log('UserID: ',userID);
    if(!userID){
        return response.json({success:0,message:'No UserID'});
    }
    User.findOne({_id:userID}, function(error,user){
        if(error){
            return response.json({success:0, message:'Invalid credentials'});
        }else if(user==null){
            return response.json({success: 0, message:'Invalid credentials'});
        }else{
            user.stream=true;
            user.save(function(error){
                if(error){
                    return response.json({success:0, message:'Unable to update stream user'})
                }
                else{
                    console.log('user',user);
                    var _email=user.email;
        
                    var name=user.first_name;
                    var message='Congratulations '+name+', \nWelcome to the Congo Stream! Enjoy your discount and expidited shipping!\n-The Congo Team';
                    var title='Welcome from the Congo Team';
                    console.log("email ",_email);
                    console.log("name ",name);
                    console.log("title ",title)
                    console.log("message ",message)
                    sendEmail(_email,title,message);
                    return response.json({success:1, message:'Successfully changed user state'})
                }
            })
        }
    });

})

app.post('/processMerchantLogin', function(request, response){

  var license=request.body['license']
  var password=request.body['password']
//   console.log('License:', license, 'Password:', password)
//   var hashedhPW=bcrypt.hashSync(password, NUM_SALTS)
  Merchant.findOne({license:license}, function(error, merchant){
    if(error){
        response.json({success:-1, message:'Server error'})
    }
    else if(merchant==null){
        response.json({success:0, message:'No merchant with this license'})
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
                    response.json({success:0, message:'Invalid password'})
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
                    response.json({success:1, message:"Login successful", userID:user._id, first_name:user.first_name,stream:user.stream});
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
                        var _email=request.body['email'];
        
                        var name=first_name+" "+last_name;
                        var message='Congratulation '+name+', \nWe have registered your account on our site. Explore the Congo!';
                        var title='Congratulations from the Congo Team';
                        console.log("email ",_email);
                        console.log("name ",name);
                        console.log("title ",title)
                        console.log("message ",message)
                        sendEmail(_email,title,message);
                        
                            return response.json({success:1, message:"Successfully registered!", user:newUser})
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

app.post('/getUserCredits', function(request,response){
    var userID = request.body['userID'];
    User.findOne({_id:userID},function(error,user){
        if(error){
            return response.json({success:-1,message:'User not found'});
        }else if(user == null){
            return response.json({success:0,message:'User is null'});
        }else{
            var credits = user.credits;
            return response.json({success:1,message:'Users Congo Credit', userCredits:credits});
        }
    })
})

app.post('/purchaseWithUserCredit', function(request,response){
    var userID = request.body['userID'];
    var cartPrice = request.body['cartPrice'];

    if(userID == null){
        return response.json({success:-2,message:'No userID given'});
    }

    if(cartPrice == null){
        return response.json({success:-2,message:'No cart price'});
    }else if(cartPrice < 0){
        return response.json({success:-2,message:'Cart price is negative'});
    }

    User.findOne({_id:userID},function(error,user){
        if(error){
            return response.json({success:0,message:'User doesnt exist'});
        }else if(user == null){
            return response.json({success:-1,message:'User is null'});
        }else{
            if((user.credits - cartPrice) < 0){
                var cost = (-1)*(user.credits - cartPrice);
                user.credits = 0;
                user.save(function(error){
                    if(error){
                        return response.json({success:0,message:'error saving user'});
                    }else{
                        return response.json({success:2,message:'Partial Purchase with Congo Credit success',cost:cost});
                    }
                })
            }else{
            user.credits = user.credits - cartPrice;
            user.save(function(error){
                if(error){
                    return response.json({success:0,message:'error saving user'});
                }else{
                    return response.json({success:1,message:'Purchase with Congo Credit success'});
                }
            })
          }
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
                                var _email=info['email'];
        
                                var name=info['name'];
                                var message='Dear, '+name+', \nThank you for registering to become a merchant. We will review your applicaiton and get back to you shortly.\n-The Congo Team';
                                var title='Thank You from the Congo Team';
                                console.log("email ",_email);
                                console.log("name ",name);
                                console.log("title ",title)
                                console.log("message ",message)
                                sendEmail(_email,title,message);
                                response.json({success:1, message:'Successfully registered!', license:license})
                            }
                        })
                    }
                }
            })
        }
    })
})

app.post('/merchantExists',function(request,resposne){
    if(!('userID' in request.body)){
        return response.json({success:0, message:'No user ID provided'})
    }
    else if(request.body['userID']==null){
        return response.json({success:0, message:'No user ID provided'})
    }
    var info=request.body['info']
    var userID=request.body['userID']
    User.findOne({_id: userID}, function(error, user){
        if(error){
            return response.json({success:0, message:"Could not find a user with request id"})
        }
        else{
            // info['user']=user
            // return response.json({success:1, message:'Successfully found user'})
            Merchant.find({$or:[{name:info['name']}, {url:info['url']}]}, function(error, merchants){
                if(error){
                   return response.json({success:-2, message:'Server error'});
                }
                else{
                    if(merchants.length!=0){
                        return resposne.json({success:0,message:'Merchant Exists'});
                    }
                    else{
                      return resposne.json({success:1,message:'New Merchant'});
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
    //UPDATE PURCHASE COUNT OF EVERY ITEM AROUND THIS CALL
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
                var totalItems=0;
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
                    totalItems+=item.quantity
                }
                var newOrder = new Order({userID:request.body['userID'], street_address:street, city:city, state:state, zip_code:zip_code, country:'United States', shipping:parseFloat(shipping), tempID:tempID, total:0, items:totalItems})

                currentTotal=currentTotal+parseFloat(shipping)+parseFloat(tax);
                currentTotal = Math.floor(currentTotal * 100) / 100;
                // newOrder.total=currentTotal
                newOrder.total=Math.floor(currentTotal * 100) / 100;
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
                                    item.merchantLicense=item.product.merchantLicense
                                    item.street_address=order.street_address
                                    item.city=order.city
                                    item.state=order.state
                                    item.zip_code=order.zip_code
                                    var name=user.first_name+' '+user.last_name
                                    item.name=name
                                    var newOrderItem = new OrderItem(item)
                                    newOrderItem.save(function(error){
                                        if(error){
                                            console.log("Unable to save a product")
                                            return response.json({success:0, message:'Unable to save order Item'})
                                        }
                                    })
                                }
                                if(j==items.length){
                                    Cart.deleteOne({userID:request.body['userID']}, function(error){
                                        if(error){
                                            return response.json({success:0, message:'There was an error deleting the Cart'})
                                        }
                                        else{
                                            var email=user.email
                                            var name=user.first_name
                                            var title=`Congo Order #${order._id} Placed`
                                            var message=`Hello ${name},\n\nYou have successfully placed Order No. ${order._id}.\nYour order total was ${order.total}\n\nThe following items were purchased:\n`
                                            for(var i=0; i<items.length; i++){
                                                message+=`${items[i].product.name}\tSize: ${items[i].size}\tQuantity: ${items[i].quantity}\tColor: ${items[i].color}\n`
                                            }
                                            message+='\nThanks for Shopping with us!\n\n\t-The Congo Team'
                                            sendEmail(email, title, message)
                                            return response.json({success:1, message:'Successfully created Order',order:newOrder})
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
                        OrderItem.find({orderID:order._id}, function(error, items){
                            if(error){
                                return response.json({success:-1, message:'Server Error'})
                            }
                            else{
                                return response.json({success:1, message:'Successfully fetched order items', items:items, total:order.total})
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

app.get('/getFeatured',function(request,response){
    var promoteProducts = [];
    Product.find({promoted: true}, function(error,products){
        if(error){
            return response.json({succes:-1,message:'Server error'});
        }else{
            // console.log("Promo prods ",products);
            return response.json({success:1,message:'Successfully got promoted products',products:products});
        }
    })
})

app.get('/getFeaturedZZZ', function(request, response){
    var bigBannerProducts = [];
    var smallBannerProducts = [];
    var featuredProducts = [];
    Product.find({promotionType:'BB'}, function(error, products){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
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
            //End of fetching bigBanner Products
            Product.find({promotionType:'SB'}, function(error, products){
                if(error){
                    return response.json({success:-1, messag:'Server error'})
                }
                else{
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
                //End of fetching smallBanner products
                Product.find({promotionType:'FP'}, function(error,products){
                    if(error){
                        return response.json({success:-1, message:'Server error'})
                    }
                    else{
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
                    }
                    //End of fetching Featured Products
                    return response.json({success: 1, message: "Successfully fetched all featured products", bigBanner: bigBannerProducts, smallBanner: smallBannerProducts, featuredProducts: featuredProducts});
                })
            })
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
            var newReview = new Review({userID:userID, rating:rating, review:review, productID:productID, first_name:user.first_name, last_name:user.last_name})
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

app.post('/updateProductRating', function(request,response){
    var productID = request.body['productID'];
    Product.findOne({_id:productID},function(error,product){
        if(error){
            return response.json({success:-1,message:'unable to find product'});
        }else if(product == null){
            return response.json({success:0,message:'unable to find the product'})
        }else{
            var ratingAmount = product['reviews'].length;
            var ratingTotal = 0;
            console.log(ratingAmount);
            for(var i = 0; i < ratingAmount; i++){
                ratingTotal += product['reviews'][i]['rating'];
                if(i == (ratingAmount-1)){
                    var rate = (ratingTotal / ratingAmount);
                   rate = Math.round(rate);
                    product.rating = rate;
                    product.save(function(error){
                        if(error){
                            return response.json({success:-2,message:'Can not save rating'});
                        }else{
                            return response.json({success:1,message:'updated product rating'});
                        }
                    })
                }
            }

        }
    })
})

app.post('/processAdminLogin', function(request, response){
    var email=request.body['email']
    var password=request.body['password']
    var pin=request.body['pin']
    console.log("Email:", email, "password:", password, "pin:", pin)
    User.findOne({email:email}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'Unable to find user'})
        }
        else{
            //Successfully found user
            if(bcrypt.compareSync(password, user.password)==false){
                return response.json({success:0, message:'Passwords do not match'})
            }
            else{
                //Passwords match
                if(user.user_level!=9){
                    return response.json({success:-2, message:'This user does not have admin privileges'})
                }
                else{
                    //User is an admin
                    if(user.pin==null){
                        return response.json({success:-2, message:'This user has a PIN which has not been set up yet. Contact another site administrator'})
                    }
                    else{
                        if(user.pin!=pin){
                            return response.json({success:0, message:'Invalid PIN'})
                        }
                        else{
                            return response.json({success:1, message:'Admin login successful', userID:user._id, first_name:user.first_name})
                        }
                    }
                }
            }
        }
    })
})

app.post('/getReviews/:productID', function(request, response){
    var productID=request.params['productID']
    var userID=request.body['userID']
    var checkUser=request.body['checkUser']

    Product.findOne({_id:productID}, function(error, product){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(product==null){
            return response.json({success:0, message:'Unable to find product'})
        }
        else{
            product.views=product.views+1
            product.save(function(error){
                if(error){
                    return response.json({success:0, message:'Unable to update product views'})
                }
                else{
                    if(checkUser==false){
                        return response.json({success:1, message:'Successfully found product', reviews:product.reviews})
                    }
                    //Successfully saved product, now add to user history
                    User.findOne({_id:userID}, function(error, user){
                        if(error){
                            return response.json({success:0, message:'Server error'})
                        }
                        else if(user==null){
                            return response.json({success:1, message:'Successfully fetched product, however userID invalid', reviews:product.reviews})
                        }
                        else{
                            user.history.push(product);
                            user.save(function(error){
                                if(error){
                                    return response.json({success:1, message:'Unable to push product to user history', reviews:product.reviews})
                                }
                                else{
                                    return response.json({success:1, message:'Successfully fetched product review, and added to user history', reviews:product.reviews, history:user.history})
                                }
                            })
                        }
                    })
                }
            })
            // return response.json({success:1, message:'Successfully found product', reviews:product.reviews})
        }
    })

})

// app.get('/getReviews/:productID', function(request, response){
//     var productID=request.params['productID']
//     Product.findOne({_id:productID}, function(error, product){
//         if(error){
//             return response.json({success:-1, message:'Server error'})
//         }
//         else if(product==null){
//             return response.json({success:0, message:'Unable to find product'})
//         }
//         else{
//             return response.json({success:1, message:'Successfully found product', reviews:product.reviews})
//         }
//     })
// })

app.post('/purchaseGiftCard', function(request, response){
    var buyerID=request.body['userID']
    var amount=request.body['amount']
    var cardNum=createGiftCardNumber()
    console.log(cardNum);
    var newCard = new GiftCard({buyerID:buyerID, cardNumber:cardNum, value:amount})
    User.findOne({_id:buyerID}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user found with this id'})
        }
        newCard.save(function(error){
            if(error){
                 console.log(error);
                return response.json({success:0, message:'Unable to create gift card'})
            }
            else{
                var email=user.email
                var name=user.first_name
                var title='Congo Gift Card Purchased'
                var message=`Hello ${name},\n\nYou have successfully purchased a gift card with value $${amount}.\nThe card number is: ${cardNum}\nHappy Spending!\n\n-The Congo Team`
                sendEmail(email, title, message)
                return response.json({success:1, message:'Successfully created Gift Card', card:newCard})
            }
        })
    })
})



app.post('/redeemGiftCard', function(request, response){
    var userID=request.body['userID']
    var cardNumber=request.body['cardNum']
    GiftCard.findOne({cardNumber:cardNumber}, function(error, card){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(card==null){
            return response.json({success:0, message:'Invalid Card Number'})
        }
        else{
            //Found card, now add to user credits
            if(card.active==false){
                return response.json({success:0, message:'This card has already been activated'})
            }
            var value=card.value
            User.findOne({_id:userID}, function(error, user){
                if(error){
                    return response.json({success:-1, message:'Server error'})
                }
                else if(user==null){
                    return response.json({success:0, message:'Invalid userID'})
                }
                else{
                    //Found user, 1 add credits to user, then inactivate card
                    user.credits+=value;
                    card.active=false
                    user.save(function(error){
                        if(error){
                            return response.json({success:0, message:'Unable to add credits to user'})
                        }
                        else{
                            card.save(function(error){
                                if(error){
                                    return response.json({success:0, message:'Unable to inactivate card'})
                                }
                                else{
                                    var _email=user.email;
        
                                    var name=user.first_name;
                                    var message='Congratulations '+name+', \nThank you for redeeming a Congo gift card. You now have $'+value+' in your account.\n-The Congo Team';
                                    var title='Thank You from the Congo Team';
                                    console.log("email ",_email);
                                    console.log("name ",name);
                                    console.log("title ",title)
                                    console.log("message ",message)
                                    sendEmail(_email,title,message);
                                    return response.json({success:1, message:'Successfully redeemed card', userCredits:user.credits})
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.get('/getActiveMerchants', function(request, response){
    //Change this status to true
    Merchant.find({approved:true}, function(error, merchants){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
            // var returnMerchants=[]
            // for(merchant in merchants){
            //     var tempMerchant={name:'', _id:''}
            //     tempMerchant.name=merchant.name
            //     tempMerchant._id=merchant._id;
            //     returnMerchants.push(tempMerchant)
            // }
            return response.json({success:1, message:'Successfully fetched all merchants', merchants:merchants})
        }
    })
})
app.get('/getPendingMerchants', function(request, response){
    Merchant.find({approved:false}, function(error, merchants){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
            // var returnMerchants=[]
            // for(merchant in merchants){
            //     var tempMerchant={name:'', _id:''}
            //     tempMerchant.name=merchant.name
            //     tempMerchant._id=merchant._id;
            //     returnMerchants.push(tempMerchant)
            // }
            return response.json({success:1, message:'Successfully fetched all merchants', merchants:merchants})
        }
    })
})
app.post('/approveMerchant', function(request, response){
    var userID=request.body['userID']
    var merchantID=request.body['merchantID']
    console.log("userID:",userID, "merchantID", merchantID)
    User.findOne({_id:userID}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user exists'})
        }
        else if(user.user_level!=9){
            return response.json({success:0, message:'User is not an admin'})
        }
        else{
            //Found user and user is an admin
            Merchant.findOne({_id:merchantID}, function(error, merchant){
                if(error){
                    return response.json({success:-1, message:'Server error'})
                }
                else if(merchant==null){
                    return response.json({success:0, message:'No merchant with this ID'})
                }
                else if(merchant.approved==true){
                    return response.json({success:0, message:'This merchant has already been approved'})
                }
                else{
                    console.log("Approval Merchant Before:", merchant)
                    merchant.approved=true;
                    console.log("Approval Merchant After:", merchant)
                    merchant.save(function(error){
                        if(error){
                            return response.json({success:0, message:'Unable to approve this merchant', error:error})
                        }
                        else{
                            var email=merchant.email
                            var name=merchant.name
                            var license=merchant.license
                            var message='Congratulations '+name+', \nWe have approved your company as merchants on our site. This comes with a great deal of responsibility, but we feel that you can succeed.\n Your license number is: '+license+'. \n\nWelcome to the family!\n\n-The Congo Team'
                            var title='Congratulations from the Congo Team'
                            sendEmail(email, title, message)
                            return response.json({success:1, message:'Successfully approved this merchant', merchantName:merchant.name, approved:merchant.approved})
                        }
                    })
                }
            })
        }
    })
})
app.post('/rejectMerchant', function(request, response){
    var userID=request.body['userID']
    var merchantID=request.body['merchantID']
    User.findOne({_id:userID}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user exists'})
        }
        else if(user.user_level!=9){
            return response.json({success:0, message:'User is not an admin'})
        }
        else{
            //Found user and user is an admin
            Merchant.deleteOne({_id:merchantID}, function(error){
                if(error){
                    return response.json({success:0, message:'Unable to reject this merchant'})
                }
                else{
                    var email=user.email
                    var name=user.name
                    var message=`We\'re sorry to inform you, ${name}, but we unfortunately have to reject your application for merchant.\nAfter thoroughly reviewing your application, we felt that your company was not a good fit for selling products on our site. Thank you for you're interest.\nSincerely,\n\tThe Congo Team `
                    var title='Update from the Congo Team'
                    sendEmail(email, title, message)
                    return response.json({success:1, message:'Successfully rejected this merchant'})
                }
            })
        }
    })
})

app.post('/processPayment', function(request, response){
    console.log("Recieved a request")
    var number=request.body['cardNum']
    var exp_month=request.body['exp_month']
    var exp_year=request.body['exp_year']
    var cvc=request.body['cvc']
    var amount=parseInt(request.body['amount'])
    //dummy email and
    stripe.tokens.create({card: {
        "number":number,
        "exp_month":exp_month,
        "exp_year":exp_year,
        "cvc":cvc
    }}, function(error, token){
        if(error){
            return response.json({success:0, message:'Unable to create stripe card token', error:error, display_message:'Invalid Card Information'})
        }
        else{
            //Successfully got token
            stripe.charges.create({
                amount: amount,
                currency: "usd",
                source: token['id'],
                // source: "tok_visa",
                description: "Charge for purchases made on Congo"
            }, function(error, charge) {
                if(error){
                    return response.json({success:0, message:'Unable to create charge', error:error, display_message:'Insufficient Funds'})
                }
                else{
                    //Hold on to charge id
                    return response.json({success:1, message:'Successfully created charge'})
                }
            });
        }
    })
})

app.post('/getHistory', function(request, response){
    var userID=request.body['userID']
    User.findOne({_id:userID}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user exists with this ID'})
        }
        else{
            return response.json({success:1, message:'Successfully fetched user history', history:user.history})
        }
    })
})

app.post('/fetchMerchantOrderItems', function(request, response){
    var merchantLicense=request.body['merchantLicense']
    OrderItem.find({merchantLicense:merchantLicense}, function(error, items){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
            return response.json({success:1, message:'Successfully fetched items', items:items})
        }
    })
})

app.post('/updateSoldCount', function(request, response){
    console.log("Recieved update count request")
    var orderID=request.body['orderID']
    OrderItem.find({orderID:orderID}, function(error, items){
        if(error){
            return response.json({success:0, message:'Unable to update sold count of items'})
        }
        else{
            var i;
            for(i=0; i<items.length; i++){
                console.log("item:", items[i])
                var quantity=items[i]['quantity']
                var productID=items[i].product._id
                Product.findOne({_id:productID}, function(error, product){
                    if(error){
                        return response.json({success:0, message:'Server error'})
                    }
                    else if(product==null){
                        console.log("No product exists with this id")
                    }
                    else{
                        product.num_sold=product.num_sold+quantity
                        product.save(function(error){
                            if(error){
                                return response.json({success:0, message:'Unable to save product after updating sold count'})
                            }
                            else{
                                console.log("Successfully updated sold count for", product.name)
                            }
                        })
                    }
                })
            }
            if(i==items.length){
                return response.json({success:1, message:'Successfully updated all product sold counts'})
            }
        }
    })
})
app.post('/getProductsForMerchant', function(request, response){
    var license=request.body['license']
    Product.find({merchantLicense:license}, function(error, products){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
            return response.json({success:1, message:'Successfully fetched products', products:products})
        }
    })

})
app.get('/getVisits', function(request, response){
    Site.find({}, function(error, sites){
        if(sites.length==0){
            return response.json({success:0, message:'No site exists yet'})
        }
        else{
            return response.json({success:1, message:'Successfully got site visits', visits:sites[0].visits})
        }
    })
})
app.post('/getAllOrders',function(request, response){
    var userID=request.body['userID']
    User.findOne({_id:userID}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else if(user==null){
            return response.json({success:0, message:'No user exists'})
        }
        else{
            if(user.user_level!=9){
                return response.json({success:0, message:'This user is not an admin'})
            }
            //User is an admin
            Order.find({}, function(error, orders){
                if(error){
                    return response.json({success:-1, message:'Failed when fetching all orders'})
                }
                else{
                    return response.json({success:1, message:'Successfully fetched all orders', orders:orders})
                }
            })
        }
    })
})
app.post('/getRecentOrders', function(request, response){
    var userID=request.body['userID']
    // Order.find({userID:userID}, {sort:{'createdAt':'-1'}}, {limit:20}, function(error, orders){
    Order.find({userID:userID}, function(error, orders){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
            return response.json({success:1, message:'Successfully fetched orders', orders:orders})
        }
    })
})
app.post('/recommendedListRaw', function(request, response){
    var category=request.body['category']
    var tag=request.body['tag']
    Product.find({$and:[{category:category}, {tag:tag}]}, function(error, products){
        if(error){
            return response.json({success:-1, message:'Server error'})
        }
        else{
            return response.json({success:1, message:'Successfully fetched products that match this category and tag', products:products, category:category, tag:tag})
        }
    })
})

// Dummy functions delete when going live
app.post('/makeAdmin', function(request, response){
    var userID=request.body['userID']
    var pin=request.body['pin']
    User.findOneAndUpdate({_id:userID}, {$set: {user_level:9, pin:pin}}, function(error, user){
        if(error){
            return response.json({success:-1, message:'Server error or saving error'})
        }
        else if(user==null){
            return response.json({success:0, message:'Unable to find user'})
        }
        else{
            return response.json({success:1, message:'Successfully made this user an Admin', user:{email:user.email, user_level:user.user_level, pin:user.pin}})
        }
    })
})

app.get('/emailTest', function(request, response){
    var email='mahesh.ashwin1998@gmail.com'
    var name='Ashwin Mahesh'
    var license='ABCDEFHJ123'
    var message='Congratulations '+name+', \nWe have approved your company as merchants on our site. This comes with a great deal of responsibility, but we feel that you can succeed.\nYour license number is: '+license+'. \nWelcome to the family!\n-The Congo Team'
    var title='Congratulations from the Congo Team'
    sendEmail(email, title, message)
})
//End of dummy functions

app.all('*', (request, response, next)=>{
    Site.find({}, function(error, sites){
        if(sites.length==0){
            var newSite=new Site({visits:1});
            newSite.save(function(error){
                if(error){
                    console.log('Error creating new site stats')
                }
            })
        }
        else{
            //found existing site
            sites[0].visits+=1
            sites[0].save(function(error){
                if(error){
                    console.log('Unable to update site visit count')
                }
            })
        }

    })
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
                //Random upperCase letter
            }
            else{
                var toAdd=String.fromCharCode(Math.floor(Math.random()*26+97))
                hashed+=toAdd
                //Random lowerCase letter
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

function createGiftCardNumber(){
    var hashed=''
    for(var i=0; i<16; i++){
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
                //Random upperCase letter
            }
            else{
                var toAdd=String.fromCharCode(Math.floor(Math.random()*26+97))
                hashed+=toAdd
                //Random lowerCase letter
            }
        }

    }
    return hashed;
    // GiftCard.findOne({cardNumber:hashed}, function(error, card){
    //     if(error){
    //         return -1;
    //     }
    //     else if(card!=null){
    //         return createGiftCardNumber()
    //     }
    //     else{
    //         return hashed
    //     }
    // })
}

function sendEmail(reciever, subject, message){
    var mailerOptions={
        from:'Congo Corporation <congo30700@gmail.com>',
        to:reciever,
        subject:subject,
        text:message
    }
    transporter.sendMail(mailerOptions, function(error, response){
        if(error){
            console.log(error)
        }
        else{
            console.log("Email sent!")
        }
    })
}