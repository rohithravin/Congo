import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-merchant-reg2',
  templateUrl: './merchant-reg2.component.html',
  styleUrls: ['./merchant-reg2.component.css']
})
export class MerchantReg2Component implements OnInit {

  showErr_cardNum:boolean;
  showErr_expDate:boolean;
  showErr_cvc:boolean;

  url:string;
  email:string;
  description:string;
  companyName:string;
  bankNum:number;
  accountNum:number;
  password:string;

  cardNum:number;
  cvc:number;
  expDate:string;

  constructor(private _router: Router,  private _httpService:HttpService) {

    this.showErr_cvc = false;
    this.showErr_expDate = false;
    this.showErr_cardNum = false;

    this.cardNum;
    this.cvc;
    this.expDate = "";

    this.url = localStorage.getItem('merchant-url');
    this.password = localStorage.getItem('merchant-password');
    this.email = localStorage.getItem('merchant-email');
    this.description = localStorage.getItem('merchant-description');
    this.companyName = localStorage.getItem('merchant-companyName');
    this.bankNum = parseInt(localStorage.getItem('merchant-bankNum'),10);
    this.accountNum = parseInt(localStorage.getItem('merchant-accountNum'),10);

  }

  ngOnInit() {}

  submitButton(){
    if (this.cardNum == null || this.cardNum.toString().length != 16){
      this.showErr_cardNum = true;
    }
    else{
      this.showErr_cardNum = false;
    }
    if (this.cvc == null || this.cvc.toString().length != 3){
      this.showErr_cvc = true;
    }
    else{
      this.showErr_cvc = false;
    }
    if(this.expDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/) == null){
      this.showErr_expDate = true;
    }
    else{
      this.showErr_expDate = false;
    }
    if (this.showErr_cvc == false && this.showErr_cardNum == false &&
      this.showErr_expDate == false){
       console.log("everything is good here." + this.companyName);
       var err=this._httpService.createMerchant(this.url, this.email, this.description, this.companyName, this.bankNum, this.accountNum, this.cardNum, this.expDate, this.cvc, this.password);
       this._router.navigate(['/merchant-reg-conf']);
       //NEED TO FINISH THIS
    }
  }

}
