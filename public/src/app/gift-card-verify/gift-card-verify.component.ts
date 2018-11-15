import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gift-card-verify',
  templateUrl: './gift-card-verify.component.html',
  styleUrls: ['./gift-card-verify.component.css']
})
export class GiftCardVerifyComponent implements OnInit {
  giftCardNumber:string;
  showErr_gcNum:boolean;
  userID:string;
  show_success:boolean;
  show_fail:boolean;
  creditAmount:any;
  constructor(private _httpService:HttpService, private _router:Router) {
    this.giftCardNumber = "";
    this.showErr_gcNum = false;
    this.show_success = false;
    this.show_fail = false;
    this.userID =localStorage.getItem('userID');
   }

  ngOnInit() {
    if(localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['/login'])
    }
    if(!localStorage.getItem('userID')){
      this._router.navigate(['/login']);
    }
  }

  submitGiftCard(){
    if(this.giftCardNumber == "") {
      this.showErr_gcNum = true;
    }else{
     
      if(this.giftCardNumber.length < 16){
        this.showErr_gcNum = true;
      }else{
      this.showErr_gcNum = false;
      }
    }
    if(!this.showErr_gcNum){
      console.log("HEnlo");
      var redeemObs=this._httpService.redeemGiftCard(this.userID, this.giftCardNumber);
      redeemObs.subscribe(data=>{
        console.log("Received response:", data)
        if(data['success']==1){
          //succcccc
          this.giftCardNumber = "";
          this.creditAmount = data['userCredits'];
          this.show_success = true;
        }else{
          //not succcc
          this.show_fail = true;

        }
      })
    }
    
  }
}
