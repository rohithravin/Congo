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
  fetchSearchedProducts(searchQuery){
    return this._http.post('/fetchSearchedProducts', {searchQuery:searchQuery})
  }
  createDummyProduct(product){
    return this._http.post('/createDummyProduct', {product: product}, {withCredentials:true})
  }

  loginUser(email, password){
    console.log("checkpoint 2.");
    return this._http.post('/processLogin', {email:email , password:password})
  }

  loginMerchant(license, password){
    console.log("checkpoint 2." + license + " " + password);
    return this._http.post('/processLoginMerchant', {license:license , password:password})
  }

  createMerchant(url, email, description, companyName, bankNum, accountNum, cardNum, expDate, cvc, password, userID){
    console.log("HttpService here. " + password);
    return this._http.post('/processMerchantRegistration', {info:{url:url, email:email, description:description, name:companyName, routingNumber:bankNum, bankAccountNumber:accountNum, creditCardNum:cardNum, creditCardExp_month:'01', creditCardExp_year:'20', creditCard_CVV:cvc}, userID:userID})
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
}
