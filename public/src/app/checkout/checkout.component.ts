import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService }  from '../http.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  full_name:string;
  showErr_fullname:boolean;
  address_lineone:string;
  showErr_addr1:boolean;
  adress_linetwo:string;
  city:string;
  showErr_city:boolean;
  state:string;
  showErr_state:boolean;
  cc_number:number;
  showErr_ccNumber:boolean;
  expiration_date:number;
  showErr_exprDate:boolean;
  cvv_code:number;
  showErr_cvvCode:boolean;
  phone_num:string;
  showErr_phoneNumber:boolean;
  email:string;
  showErr_email:boolean;
  str_cvv_code:string;
  str_cc_number:string;
  

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.str_cc_number = "";
    this.str_cvv_code = "";
    this.full_name = "";
    this.showErr_fullname = false;
    this.address_lineone= "";
    this.showErr_addr1 = false;
    this.adress_linetwo = "";
    this.city= "";
    this.showErr_city = false;
    this.state="";
    this.showErr_state = false;
    this.cc_number= 0;
    this.showErr_ccNumber = false;
    this.expiration_date = 0;
    this.showErr_exprDate = false;
    this.cvv_code = 0;
    this.showErr_cvvCode = false;
    this.phone_num = "";
    this.showErr_phoneNumber = false;
    this.email = "";
    this.showErr_email =false;
   }

  ngOnInit() {


  }

  submitBilling(){

    if (this.full_name.length < 2){
      this.showErr_fullname = true;
    }else{
    console.log(this.full_name);
    this.showErr_fullname = false;
    }
   
   
   if (this.address_lineone.length < 5){
    console.log(this.address_lineone);
    this.showErr_addr1 = true;
   }else{
     this.showErr_addr1 = false;
   }


    console.log(this.expiration_date);
   if(this.expiration_date == 0){
     this.showErr_exprDate = true;
   }else{
     var expr = this.expiration_date.toString();
     this.showErr_exprDate = false;
   }

   if (this.city.length < 4){
    console.log(this.city);
    this.showErr_city = true;
   }else{
     this.showErr_city = false;
   }


  if (this.state.length < 2){
    console.log(this.state);
    this.showErr_state = true;
  }else{
    this.showErr_state = false;
  }

    console.log(this.cc_number);
    if(this.cc_number == null) {
      this.showErr_ccNumber = true;
    }else{
     
      this.str_cc_number = this.cc_number.toString();
      if(this.str_cc_number.length < 16){
        this.showErr_ccNumber = true;
      }else{
      this.showErr_ccNumber = false;
      }
    }

    console.log(this.cvv_code);
    if(this.cvv_code == null){
      this.showErr_cvvCode = true;
    }else {
      
      this.str_cvv_code = this.cvv_code.toString();
      if(this.str_cvv_code.length < 3 || this.str_cvv_code.length > 4){
        this.showErr_cvvCode = true;
      }else{
        this.showErr_cvvCode = false;
      }
    }


    console.log(this.phone_num);
    if(this.phone_num.length != 10  || '0123456789'.indexOf(this.phone_num) !== -1){
      console.log(this.phone_num.length);
      console.log('0123456789'.indexOf(this.phone_num));
      this.showErr_phoneNumber = true;
    }else{
      this.showErr_phoneNumber = false;
    }


    
    if(this.email.match(/^\S+@\S+\.\S/) == null){
      // if(this.email.match())
  
      this.showErr_email = true;
    }else{
      console.log(this.email);
      this.showErr_email = false;
    }

  }

}
