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
  showErr_expDate2:boolean;
  showErr_cvc:boolean;
  showErr_err:boolean;

  url:string;
  email:string;
  description:string;
  companyName:string;
  bankRoutingNum:number;
  accountNum:number;
  password:string;
  errMessage_err:string;

  cardNum:number;
  cvc:number;
  expDate:string;
  expDate2:string;

  constructor(private _router: Router,  private _httpService:HttpService) {

    this.showErr_cvc = false;
    this.showErr_expDate = false;
    this.showErr_expDate2 = false;
    this.showErr_cardNum = false;
    this.showErr_err = false;
    this.errMessage_err = "";

    this.cardNum;
    this.cvc;
    this.expDate = "";
    this.expDate2 = "";

    this.url = localStorage.getItem('merchant-url');
    this.password = localStorage.getItem('merchant-password');
    this.email = localStorage.getItem('merchant-email');
    this.description = localStorage.getItem('merchant-description');
    this.companyName = localStorage.getItem('merchant-companyName');
    this.bankRoutingNum = parseInt(localStorage.getItem('merchant-bankNum'),10);
    this.accountNum = parseInt(localStorage.getItem('merchant-accountNum'),10);

  }

  ngOnInit() {
    // location.reload(true)
    // if(localStorage.getItem('reloadMerch2') == 'XXXXTrue'){
    //     localStorage.setItem('reloadMerch2', '')
    //     localStorage.removeItem('reloadMerch2')
    //     location.reload(true)
    // }
  }

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
    if(this.expDate.length != 2){
      this.showErr_expDate = true;
    }
    else{
      this.showErr_expDate = false;
    }
    if(this.expDate2.length != 2){
      this.showErr_expDate2 = true;
      console.log(this.expDate2);
    }
    else{
      this.showErr_expDate2 = false;
    }
    if (this.showErr_cvc == false && this.showErr_cardNum == false &&
      this.showErr_expDate == false && this.showErr_expDate2 == false){
      console.log("everything is good here." + this.companyName);
      var err=this._httpService.createMerchant(this.url, this.email, this.description, this.companyName, this.bankRoutingNum, this.accountNum, this.cardNum, this.expDate,this.expDate2, this.cvc, localStorage.getItem('userID'));
      err.subscribe(data=>{
         console.log("response:", data)
         if(data['success']==-1){
           this.errMessage_err = "Could Not Process Information. Contact Us.";
           console.log("Incorrect Information Provided.");
           localStorage.removeItem("merchant-url");
           localStorage.removeItem("merchant-password");
           localStorage.removeItem("merchant-email");
           localStorage.removeItem("merchant-companyName");
           localStorage.removeItem("merchant-description");
           localStorage.removeItem("merchant-bankNum");
           localStorage.removeItem("merchant-accountNum");
           this.showErr_err = true;
           return;
         }
         else if(data['success']== 0) {
           this.errMessage_err = "Server Error.";
           console.log("Server Error.");
           this.showErr_err = true;
           return;
         }
         else{
           console.log("Registration successful");
           localStorage.removeItem("merchant-url");
           localStorage.removeItem("merchant-password");
           localStorage.removeItem("merchant-email");
           localStorage.removeItem("merchant-companyName");
           localStorage.removeItem("merchant-description");
           localStorage.removeItem("merchant-bankNum");
           localStorage.removeItem("merchant-accountNum");
           this.showErr_err = false;
           this._router.navigate(['/merchant-reg-conf']);
         }
       })
       //NEED TO FINISH THIS
    }
  }

}
