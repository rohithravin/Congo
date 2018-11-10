import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  reviewRating:any;
  reviewText:string;
  productID:string;
  product:any;
  count:number;
  size:string;
  color:string;
  userID:any;
  show_ratingErr:boolean;
  show_revErr:boolean;
  show_reviewSuccess:boolean;

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.productID = '';
    this.product={};
    this.count = 1;
    this.size='';
    this.color='';
    this.reviewRating = 0;
    this.reviewText = "";
    this.userID = localStorage.getItem('userID');
    this.show_ratingErr = false;
    this.show_revErr = false;
    this.show_reviewSuccess = false;
  }

  ngOnInit() {
    this._activaterouter.params.subscribe(
      params=>{
        this.productID = params['pid'];
        console.log('productID: ' + this.productID);
      })
    this.fetchProduct()

  }

  updateCountPlus(){
    this.count = this.count + 1;
  }

  updateCountMinus(){
    if (this.count > 1){
      this.count = this.count - 1;
    }
  }

  fetchProduct(){
    console.log("Inside this Product function")
    var product=this._httpService.fetchProduct(this.productID)
    product.subscribe(data=>{
      console.log(data)
      if(data['success']==0 || data['success']==-1){
        this._router.navigate([''])
        return;
      }
      this.product = data['product'];
      this.size=data['product']['sizes'][0]
      this.color=data['product']['colors'][0]
    })
  }

 submitReview(){
   console.log("submitting review...");
   console.log(this.reviewRating);
   if(this.reviewRating == 0){
     this.show_ratingErr = true;
   }else{
     this.show_ratingErr = false;
   }
   console.log(this.reviewText);
   if(this.reviewText.length < 20){
     this.show_revErr = true;
   }else {
     this.show_revErr = false;
   }
   //productID
   //userID
   this.show_reviewSuccess = false;
   if(!this.show_ratingErr && !this.show_revErr){
     console.log("succ");
     var addReview=this._httpService.processNewReview(this.productID,this.userID,this.reviewRating,this.reviewText);
     addReview.subscribe(data=>{
       console.log(data);
       if(data['success']==1){
         console.log("added your review");
         this.reviewText = "";
         this.reviewRating = 0;
         this.show_reviewSuccess = true;
       }
     })
   }
 }

  addToCart(){
    console.log("Adding to cart")
    if(localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['login'])
      return;
    }
    var productDetails={product:this.product, size:this.size, color:this.color, quantity:this.count}
    var addCartObs=this._httpService.addToCart(productDetails, localStorage.getItem('userID'))
    addCartObs.subscribe(data=>{
      console.log(data)
      if(data['success']==1){
        this._router.navigate(['cart'])
      }
    })
  }

}
