import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-promote-product-reg',
  templateUrl: './promote-product-reg.component.html',
  styleUrls: ['./promote-product-reg.component.css']
})
export class PromoteProductRegComponent implements OnInit {

  promo_types = [
    {name: "Big Banner", value: 1},
    {name: "Small Banner", value: 2},
    {name: "Product", value: 3}
  ]
  

  selectedCCDate:string;
  selectedPromoType:string;
  selectedPromoTime:string;
  selectedCCYear:string;
  
  showPromotionType:boolean;
  showPromotionDuration:boolean;
  showErr_cvv:boolean;
  showErr_ccn:boolean;
  showErr_imgurl:boolean;
  showErr_year:boolean;
  showErr_date:boolean;
  showErr_promotype:boolean;
  showErr_duration:boolean;
  promotion_image:string;
  card_number:number;
  str_card_number:string;
  str_cvv_number:string;
  cvv_number:number;
  product_id:any;
  merchant_license:any;
  product:any;
  total_price:number;
  


  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router:Router) {
    this.showPromotionType = false;
    this.showPromotionDuration = false;
    this.showErr_ccn = false;
    this.showErr_cvv = false;
    this.showErr_imgurl = false;
    this.showErr_year = false;
    this.showErr_duration = false;
    this.showErr_promotype = false;
    this.showErr_date = false;
    this.promotion_image = "";
    this.card_number = null;
    this.cvv_number = null;
    this.str_card_number = "";
    this.selectedCCDate = "";
    this.selectedPromoTime = "";
    this.selectedPromoType = "";
    this.selectedCCYear = "";
    this.product_id = "";
    this.product = {};
    this.total_price = 0;
    this.merchant_license =  localStorage.getItem('licenseNo');

   }

  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')==null || localStorage.getItem('merchantLoggedIn')=='false'){
      this._router.navigate(['']);
    }
    else if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['']);
    }

    this._activaterouter.params.subscribe(
      params=>{
        this.product_id = params['pid'];
      })
      
      this.fetchProduct()
  }

  updatePrice(){
    if(this.selectedPromoTime != "" && this.selectedPromoType != ""){
      //now we need to set the prices of this stufff
        if (this.selectedPromoType == "Big Banner"){
          this.total_price = 5000;
         
        }else if(this.selectedPromoType == "Small Banner"){
          this.total_price = 3000;
  
        }else if(this.selectedPromoType == "Featured Product"){
          this.total_price = 1000;
     
        }

        if (this.selectedPromoTime == "Two Weeks"){
          this.total_price *= 2;
        }else if(this.selectedPromoTime == "Three Weeks"){
          this.total_price *= 3;
        }else if(this.selectedPromoTime == "Four Weeks"){
          this.total_price *= 4;
        }
        
    }
  }

  fetchProduct(){
   var product = this._httpService.fetchProduct(this.product_id);
   product.subscribe(data=>{
    if(data['success']==0 || data['success']==-1){
      this._router.navigate([''])
      return;
    }
    this.product = data['product'];
    console.log(this.product);
    console.log(this.merchant_license);
    
  })
      
  }

  promotiontypeClicked(){
    this.showPromotionType=!this.showPromotionType;
  }

  promotiondurationClicked(){
    this.showPromotionDuration=!this.showPromotionDuration;
  }

  submitPromote() {
    
      //check to assert that the image url was entered
      if(this.promotion_image.length < 5){
        this.showErr_imgurl = true;
      }else{
        this.showErr_imgurl = false;
      }
      

      //check to assert that the credit card was entered
      if(this.card_number == null) {
        this.showErr_ccn = true;
      }else{
       
        this.str_card_number = this.card_number.toString();
        if(this.str_card_number.length < 16){
          this.showErr_ccn = true;
        }else{
        this.showErr_ccn = false;
        }
      }

      //check to assert that the cvv
      
      if(this.cvv_number == null){
        this.showErr_cvv = true;
      }else {
        
        this.str_cvv_number = this.cvv_number.toString();
        if(this.str_cvv_number.length < 3 || this.str_cvv_number.length > 4){
          this.showErr_cvv = true;
        }else{
          this.showErr_cvv = false;
        }
      }

      //get the options from selectors
      if (this.selectedCCDate == null){
        this.showErr_date = true;
      }else{
        var date = this.selectedCCDate.toString();
        if(date.length != 2){
          this.showErr_date = true;
        }else{
          this.showErr_date = false;
        }
      }

      if(this.selectedCCYear == null){
        this.showErr_year = true;
      }else{
        var year = this.selectedCCYear.toString();
        if (year.length != 2){
          this.showErr_year = true;
         }else{
           this.showErr_year = false;
         }
      }
      
      


      if(this.selectedPromoTime.length == 0){
        this.showErr_duration = true;
      }else{
        this.showErr_duration = false;
      }

      if(this.selectedPromoType.length == 0){
        this.showErr_promotype = true;
      }else{
        this.showErr_promotype = false;
      }
     
      if( !this.showErr_ccn && !this.showErr_cvv && !this.showErr_date && !this.showErr_duration && !this.showErr_imgurl && !this.showErr_promotype && !this.showErr_year){
        console.log("succ");
        //all promotions begin the day after the purchase date
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        //the end date is calculated
        var endDate = new Date();
        if(this.selectedPromoTime == "One Week"){
          endDate.setDate(currentDate.getDate() + 7);
        }else if(this.selectedPromoTime == "Two Weeks"){
          endDate.setDate(currentDate.getDate() + 14);
        }else if(this.selectedPromoTime == "Three Weeks"){
          endDate.setDate(currentDate.getDate() + 21);
        }else if(this.selectedPromoTime == "Four Weeks"){
          endDate.setDate(currentDate.getDate() + 28);
        }
        //now send all the data to the database to be updated
        //productID, promotionType, endDate, license, promotionImage='false@IOnoa99okaXXa67'
     
        var error = this._httpService.promoteProduct(this.product_id,this.selectedPromoType,endDate,this.merchant_license,this.promotion_image);
        error.subscribe(data=>{
          console.log("response: ",data);
          if (data['success']==-1){
            //server error

          }else if(data['success']==0){
            //client error
          }else{
            console.log("succ p2");
          
          }
        })
  

        
        
      }

  }



  /* toggle(){
    var el = document.querySelector(".alert");
    el.classList.toggle('hide');
    
  }*/
}
