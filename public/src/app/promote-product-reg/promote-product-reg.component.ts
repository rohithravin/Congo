import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
  promo_times = [
    {name: "One day", value: 1},
    {name: "Seven days", value: 2},
    {name: "Thirty days", value: 3},
    {name: "One Year", value: 4}
  ]

  expiration_dates = [
    {name: "01", value: 1},
    {name: "02", value: 2},
    {name: "03", value: 3},
    {name: "04", value: 4},
    {name: "05", value: 5},
    {name: "06", value: 6},
    {name: "07", value: 7},
    {name: "08", value: 8},
    {name: "09", value: 9},
    {name: "10", value: 10},
    {name: "11", value: 11},
    {name: "12", value: 12}
  ]

  expiration_years = [
    {name: "2019", value: 1},
    {name: "2020", value: 2},
    {name: "2021", value: 3},
    {name: "2022", value: 4},
    {name: "2023", value: 5},
    {name: "2024", value: 6},
    {name: "2025", value: 7},
    {name: "2026", value: 8},
    {name: "2027", value: 9},
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


  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService) {
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
   }

  ngOnInit() {
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
     
      if(this.selectedCCDate.length == 0){
        this.showErr_date = true;
      }else{
        this.showErr_date = false;
      }

      if (this.selectedCCYear.length == 0 || this.selectedCCYear.length == 10){
       this.showErr_year = true;
      }else{
        this.showErr_year = false;
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
        
        

        
        
      }

  }



  /* toggle(){
    var el = document.querySelector(".alert");
    el.classList.toggle('hide');
    
  }*/
}
