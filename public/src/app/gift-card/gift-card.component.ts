import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.css']
})
export class GiftCardComponent implements OnInit {
      cc_number:number;
      showErr_ccNumber:boolean;
      cvv_number:number;
      showErr_cvvCode:boolean;
      cc_month:number;
      showErr_ccMonth:boolean;
      cc_year:number;
      showErr_ccYear:boolean;
      cc_cardAmount:any;
      showErr_amount:boolean;
      userID:string;
      showERROR:boolean;
      show_fail:boolean;
      stripe_resp:string;


  constructor(private _httpService: HttpService,private _router:Router) {
      this.show_fail = false;
      this.stripe_resp = "";
        this.showErr_ccNumber = false;
        this.showErr_cvvCode = false;
        this.showErr_ccMonth = false;
        this.showErr_ccYear = false;
        this.showErr_amount = false;
        this.showERROR = false;
        this.userID = localStorage.getItem('userID');
  }

  ngOnInit() {
        if(localStorage.getItem('loggedIn')=='false'){
             this._router.navigate(['/login']);
        }
        if(!localStorage.getItem('userID')){
             this._router.navigate(['/login']);
        }

  }

  submit(){
       console.log(this.cc_number);
       console.log(this.cvv_number);
       console.log(this.cc_month);
       console.log(this.cc_year);
       console.log(this.cc_cardAmount);

        if(!this.cc_cardAmount){
             this.showErr_amount = true;
      }else{
            this.showErr_amount = false;
      }

      if(!this.showErr_amount){

            var stripeObs = this._httpService.stripePurchase(this.cc_number,this.cc_month,this.cc_year,this.cvv_number,this.cc_cardAmount*100);
            stripeObs.subscribe(data=>{
                  if(data['success'] == 1){
                        var obs=this._httpService.purchaseGiftCard(this.userID, this.cc_cardAmount)
                        obs.subscribe(data=>{
                        console.log("Received response:", data)
                        if(data['success']==1){
                              console.log("successfully created giftcard!");
                              var giftCardVal = data['card']['value'];
                              var giftCardNumber = data['card']['cardNumber'];
                              console.log(giftCardVal);
                              if(giftCardVal){
                                    localStorage.setItem('giftCard',giftCardVal);
                                    localStorage.setItem('giftCardNumber', giftCardNumber);

                                    this._router.navigate(['/giftcard/confirmation'])
                              }


                        }
                        else{
                              this.showERROR = true;
                              console.log(this.showERROR);
                        }
                     })
                  }else{
                        //stripe error
                        this.show_fail = true;
                        this.stripe_resp = data['display_message'];
                  }
            })


            
      }

  }
}
