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
  reviews:any;
  show_noReviews: boolean;
  first_name :string;
  showErr_color:boolean;
  selectedColor:string;
  showErr_size:boolean;
  selectedSize:string;
  previouslyViewed:any;
  shownPrevious:any;
  showErr_noPrev:boolean;
  exists:boolean;

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.exists = false;
    this.shownPrevious = [];
    this.previouslyViewed = [];
    this.showErr_noPrev = false;
    this.selectedColor = "";
    this.selectedSize = "";
    this.showErr_size = false;
    this.showErr_color = false;
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
    this.reviews = {};
    this.show_noReviews = false;
    this.first_name = localStorage.getItem('firstName');
  }

  ngOnInit() {
    this._activaterouter.params.subscribe(
      params=>{
        this.productID = params['pid'];
        console.log('productID: ' + this.productID);
      })
    this.fetchProduct()
    this.fetchReviews()
    this.fetchPreviouslyViewed();

  }

  routeToPrev(productID){
    console.log("Calling router function")
    this._router.navigate(['/product',productID]);
    this._activaterouter.params.subscribe(
      params=>{
        this.productID = params['pid'];
        console.log('productID: ' + this.productID);
      })
    this.fetchProduct()
    this.fetchReviews()
  }

  fetchPreviouslyViewed(){
    
    var histObs=this._httpService.getHistory(localStorage.getItem('userID'));
    histObs.subscribe(data=>{
      console.log("hist ",data);
      if(data['success']==1){
        this.previouslyViewed = data['history'];
        console.log("prev ",this.previouslyViewed);
        if(this.previouslyViewed.length == 0){
          this.showErr_noPrev = true;
        }else{
          this.showErr_noPrev = false;
          if(this.previouslyViewed.length > 5){
            //no repeats only five
            this.previouslyViewed.forEach(element => {
              this.exists = false;
              if(this.shownPrevious.length < 5){

                if(this.shownPrevious.length == 0){
                  this.shownPrevious.push(element);
                }else{
                  for(var i = 0; i < this.shownPrevious.length;i++){
                    if(this.shownPrevious[i]['_id'] == element['_id']){
                      this.exists = true;
                    }
                    if(i == this.shownPrevious.length-1){
                      if(this.exists == false){
                        
                        this.shownPrevious.push(element);
                      }
                    }
                  }
                }


             

              }
            });
          }else{
            this.shownPrevious = this.previouslyViewed
          }
          console.log("shown ",this.shownPrevious);
        }
      }else{
        this.showErr_noPrev = true;
        //error
      }
    })
  }

  updateCountPlus(){
    this.count = this.count + 1;
  }

  updateCountMinus(){
    if (this.count > 1){
      this.count = this.count - 1;
    }
  }

  fetchReviews(){
    console.log("fetching reviews");
    var checkUser=false;
    if(this.userID!=null){
      checkUser=true;
    }
    var reviews=this._httpService.fetchProductReviews(this.productID, this.userID, checkUser);
    reviews.subscribe(data=>{
      console.log(data);
      if(data['success']==1){
        console.log("retrieved reviews");
        this.reviews = data['reviews'];
        if(this.reviews.length == 0){
          console.log("empty");
          this.show_noReviews = false;
        }else{
        this.reviews = this.reviews.slice().reverse();
        console.log(this.reviews);
        this.show_noReviews = true;
        }
      }
      if(data['success'] != 1){
        this.show_noReviews = false;
      }
    })
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
         this.fetchReviews();
          var upRating = this._httpService.updateProductRating(this.productID);
          upRating.subscribe(data=>{
            console.log(data);
          })
       }else{
         console.log("review failed to be added");
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
    this.showErr_color = false;
    this.showErr_size = false;
    console.log("color",this.selectedColor);
    console.log("size",this.selectedSize);
    if(this.selectedColor == ""){
      this.showErr_color = true;
    }
    if(this.selectedSize == ""){
      this.showErr_size = true;
    }
    if(!this.showErr_color && !this.showErr_size){
      var productDetails={product:this.product, size:this.selectedSize, color:this.selectedColor, quantity:this.count}
      var addCartObs=this._httpService.addToCart(productDetails, localStorage.getItem('userID'))
      addCartObs.subscribe(data=>{
        console.log(data)
        if(data['success']==1){
          this._router.navigate(['cart'])
        }
      })
    }

  }

}
