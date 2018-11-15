import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gift-card-verify',
  templateUrl: './gift-card-verify.component.html',
  styleUrls: ['./gift-card-verify.component.css']
})
export class GiftCardVerifyComponent implements OnInit {
  giftCardNumber:number;
  showErr_gcNum:boolean;
  userID:string;
  constructor(private _httpService:HttpService, private _router:Router) {
    this.giftCardNumber;
    this.showErr_gcNum = false;
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
    if(this.giftCardNumber == null) {
      this.showErr_gcNum = true;
    }else{
     
      var str_gc_number = this.giftCardNumber.toString();
      if(str_gc_number.length < 16){
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
          this.giftCardNumber = 0;
        }else{
          //not succcc

        }
      })
    }
    
  }
}
