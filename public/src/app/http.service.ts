import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {

  }

  fetchFeatured(){
    return this._http.get('/getFeatured')
  }
  fetchProduct(productID){
    return this._http.get(`/getProduct/${productID}`)
  }
  fetchProductReviews(productID){
    return this._http.get(`/getReviews/${productID}`);
  }
  fetchSearchedProducts(searchQuery){
    return this._http.post('/fetchSearchedProducts', {searchQuery:searchQuery})
  }

  fetchUserCredits(userID){
    return this._http.post('/getUserCredits',{userID:userID});
  }

  PurchaseWithCongoCredit(userID,cartPrice){
    return this._http.post('/purchaseWithUserCredit',{userID:userID,cartPrice:cartPrice});
  }

  redeemGiftCard(userID, cardNum ){
    return this._http.post('/redeemGiftCard', {userID:userID,cardNum:cardNum});
  }

  fetchCategorySearchedProducts(searchQuery, category){
    return this._http.post('/fetchSearchedProductsWithCategory', {searchQuery:searchQuery ,category:category})
  }

  updateProductRating(productID){
    return this._http.post('/updateProductRating', {productID: productID});
  }

  createDummyProduct(product, licenseNo){
    return this._http.post('/createDummyProduct', {product: product, license:licenseNo}, {withCredentials:true})
  }

  loginUser(email, password){
    console.log("checkpoint 2.");
    return this._http.post('/processLogin', {email:email , password:password})
  }

  loginMerchant(license, password){
    console.log("checkpoint 2." + license + " " + password);
    return this._http.post('/processMerchantLogin', {license:license , password:password})
  }

  verifyMerchantReg(url, name){
    console.log("HttpService here. verfit merchant reg " + name);
    return this._http.post('/checkMerchantReg', {url:url ,name:name})
  }

  createMerchant(url, email, description, companyName, bankNum, accountNum, cardNum, creditCardExp_month, creditCardExp_year, cvc, userID){
    console.log("HttpService here. " + creditCardExp_year);
    return this._http.post('/processMerchantRegistration', {info:{url:url, email:email, description:description, name:companyName, routingNumber:bankNum, bankAccountNumber:accountNum, creditCardNum:cardNum, creditCardExp_month:creditCardExp_year, creditCardExp_year:creditCardExp_year, creditCard_CVV:cvc}, userID:userID})
  }
  createStreamUser(userID){
    return this._http.post('/processStreamRegistration',{userID:userID});
  }

  createNewUser(first_name, last_name, email, phone_num, password){
    console.log("checkpoint 1.");
    return this._http.post('/processRegister', {first_name: first_name, last_name:last_name, email:email, phone_num:phone_num, password:password}, {withCredentials:true})
  }
  processLogin(email, password){
    return this._http.post('/processLogin', {email:email, password:password}, {withCredentials:true})
  }
  addToCart(productDetails, userID){
    return this._http.post('/processAddToCart', {details:productDetails, userID: userID})
  }
  fetchCart(userID){
    // return userID
    return this._http.post('/getCart', {doubleCheck:'10923unas', userID: userID})
  }
  promoteProduct(productID, promotionType, endDate, license, promotionImage='false@IOnoa99okaXXa67'){
    return this._http.post('/promoteProduct', {productID:productID, promotionType:promotionType, endDate:endDate, license:license, promotionImage:promotionImage})
  }
  fetchMerchantProducts(license){
    return this._http.post('/fetchMerchantProducts', {license:license})
  }
  editProduct(license, product, productID){
    return this._http.post('/processEdit', {license:license, product:product, productID:productID})
  }
  removeProductFromCart(userID,productID){
    return this._http.post('/removeProductFromCart',{userID:userID,productID:productID})
  }
  createOrder(userID, street, city, state, zip_code, shipping, tax){
    return this._http.post('/createOrder', {userID:userID, street:street, city:city, state:state, zip:zip_code, shipping:shipping, tax:tax})
  }
  getOrders(userID){
    return this._http.post('/getUserOrders', {userID:userID})
  }

  getOrder(userID, orderID){
    return this._http.post('/getOrderItems', {userID:userID, orderID:orderID})
  }

  changeProductState(productID, license){
    return this._http.post('/changeProductActiveState', {license:license, productID:productID})
  }
  processNewReview(productID,userID,rating,review){
    return this._http.post('/processNewReview',{productID:productID,userID:userID,rating:rating,review:review});
  }
  makeAdmin(userID, pin){
    return this._http.post('/makeAdmin', {userID:userID, pin:pin})
  }
  processAdminLogin(email, password, pin){
    return this._http.post('/processAdminLogin', {email:email, password:password, pin:pin})
  }

  purchaseGiftCard(userID, amount){
        return this._http.post('/purchaseGiftCard', {userID:userID, amount:amount});
  }
}
