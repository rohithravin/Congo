import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-merchant-reg1',
  templateUrl: './merchant-reg1.component.html',
  styleUrls: ['./merchant-reg1.component.css']
})

export class MerchantReg1Component implements OnInit {

  showErr_url:boolean;
  showErr_email:boolean;
  showErr_description:boolean;
  showErr_companyName:boolean;
  showErr_bankNum: boolean;
  showErr_accountNum:boolean;
  showErr_password:boolean;
  showErr_confirmPassword:boolean;
  showErr_err:boolean;
  errMessage_err:string;

  url:string;
  email:string;
  description:string;
  companyName:string;
  bankNum:number;
  accountNum:number;
  password:string;
  confirmPassword:string;


  constructor(private _router: Router,  private _httpService:HttpService) {
    this.showErr_url = false;
    this.showErr_email = false;
    this.showErr_description = false;
    this.showErr_companyName = false;
    this.showErr_bankNum = false;
    this.showErr_accountNum = false;
    this.showErr_err =false;
    this.errMessage_err = "";

    this.url = "";
    this.email = "";
    this.description = "";
    this.companyName = "";
    this.bankNum;
    this.accountNum;
  }

  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')!=null && localStorage.getItem('merchantLoggedIn')=='true'){
      this._router.navigate(['']);
    }
    else if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['']);
    }
  }


  nextButton(){
    console.log("hi");
    if(this.url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/) == null){
      this.showErr_url = true;
    }
    else{
      this.showErr_url = false;
    }
    if(this.email.match(/^\S+@\S+\.\S/) == null){
      this.showErr_email = true;
    }
    else{
      this.showErr_email = false;
    }
    if(this.description.length < 2){
      this.showErr_description = true;
    }
    else{
      this.showErr_description = false;
    }
    if(this.companyName.length < 2){
      this.showErr_companyName = true;
    }
    else{
      this.showErr_companyName = false;
    }
    if(this.bankNum == null || this.bankNum.toString().length != 9){
      this.showErr_bankNum = true;
    }
    else{
      this.showErr_bankNum = false;
    }
    if( this.accountNum == null || (this.accountNum.toString().length < 4  )){
      this.showErr_accountNum = true;
    }
    else{
      this.showErr_accountNum = false;
    }
    console.log("check23df");
    if(this.showErr_url == false && this.showErr_email == false &&
       this.showErr_bankNum == false && this.showErr_description == false &&
       this. showErr_companyName == false && this.showErr_accountNum == false){
          console.log("Passed Verification.");
          localStorage.setItem("merchant-url",this.url);
          localStorage.setItem("merchant-password",this.password);
          localStorage.setItem("merchant-email", this.email);
          localStorage.setItem("merchant-companyName", this.companyName);
          localStorage.setItem("merchant-description", this.description);
          localStorage.setItem("merchant-bankNum", this.bankNum.toString());
          localStorage.setItem("merchant-accountNum", this.accountNum.toString());
          console.log("All Fields Stored In Local Storage.")
          // location.reload(true)
          this._router.navigate(['/merchant/register2']);
    }
  }
}
