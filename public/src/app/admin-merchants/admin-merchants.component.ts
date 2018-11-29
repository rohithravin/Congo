import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { doesNotThrow } from 'assert';

@Component({
  selector: 'app-admin-merchants',
  templateUrl: './admin-merchants.component.html',
  styleUrls: ['./admin-merchants.component.css']
})
export class AdminMerchantsComponent implements OnInit {
  userID:string
  merchantID:string
  errMessage:string
  merchants:any
  pending:any
  active:any
  date:string
  counter:number
  show_succ:boolean;
  show_fail:boolean;
  stripe_resp:string;

  pendingSearch:string;
  activeSearch:string;
  shownPending:any;
  shownActive:any;

  constructor(private _httpService:HttpService, private _router:Router) {
    this.show_succ = false;
    this.show_fail = false;
    this.errMessage = '';
    this.merchants = [];
    this.pending = [];
    this.active = [];
    this.date = '';
    this.counter = 0;
    this.pendingSearch = "";
    this.activeSearch = "";
    this.shownActive = [];
    this.shownActive = [];

  }

  ngOnInit() {
    if(localStorage.getItem('adminLoggedIn')==null || localStorage.getItem('adminLoggedIn')=='false'){
      return this._router.navigate(['/admin/login'])
    }
    this.fetchPending();
    this.fetchActive();
  }

  searchActive(){
    this.shownActive = [];
    console.log("active ",this.active);
    this.active.forEach(element => {
      console.log("el ",element);
      console.log("m ",element['name'].toLowerCase().match(this.activeSearch.toLowerCase()));
        if(element['name'].toLowerCase().match(this.activeSearch.toLowerCase())){
          this.shownActive.push(element);
        }
    });
    console.log("active ",this.shownActive);
  }

  searchPending(){
    this.shownPending = [];
    this.pending.forEach(element => {
      if(element['name'].toLowerCase().match(this.pendingSearch.toLowerCase())){
        this.shownPending.push(element);
      }
    });
    console.log("pending ",this.shownPending);
  }

  fetchPending(){
    var p = this._httpService.getPendingMerchants()
    p.subscribe(data=>{
      console.log("Pending Response:", data)
      // console.log("inside ngOnInit")
      if(data['success'] == -1){
        // this.errMessage = "Server error";
        console.log("server error")
        return;
      }
      else if(data['success'] == 1){
          this.pending = data['merchants'];
          for(var i=0;i<this.pending.length;i++){
            this.pending[i]['index'] = i;
          }
          this.shownPending = this.pending;
      }
    })
  }

  fetchActive(){
    var a = this._httpService.getActiveMerchants()
    a.subscribe(data=>{
      console.log("Active Response:", data)
      if(data['success'] == -1){
        console.log("server error");
        return;
      }
      else if(data['success'] == 1){
        this.active = data['merchants'];
        for(var i=0;i<this.active.length;i++){
          this.active[i]['index'] = i;
        }
        this.shownActive =this.active;
      }
    })
  }

  //Add paremeter here, add index too, so you dont have to do the for loop
  approveMerchant(merchant_id, merchant_index){
    //Get merchant id from parameter

        var stripeObs = this._httpService.stripePurchase(this.pending[merchant_index]['creditCardNum'],this.pending[merchant_index]['creditCardExp_month'],this.pending[merchant_index]['creditCardExp_year'],this.pending[merchant_index]['creditCard_CVV'],15000);
        stripeObs.subscribe(data=>{
          if(data['success']==1){
            this.show_succ = true;
            this.stripe_resp = "Payment Successful!";
            var approve = this._httpService.approveMerchant(localStorage.getItem('userID'), merchant_id)
            approve.subscribe(data=>{
              console.log("Approve Response:", data);
              if(data['success'] == -1){
                console.log("server error");
                return;
              }
              else if(data['success'] == 0){
                console.log("Unable to approve this merchant");
                return;
              }
              else if(data['success'] == 1){
                
                var temp = this.pending[merchant_index];
                    this.pending.splice(merchant_index, 1);
                    for(var i=0;i<this.pending.length;i++){
                      this.pending[i]['index'] = i;
                    }
                    this.active.push(temp);
                    this.active[this.active.length-1]['index']=this.active.length-1;
                    this.shownActive = this.active;
                    this.shownPending = this.pending;
                    console.log("Merchant successfully approved");
                
              }
            })
          }else{
            this.show_fail = true;
            this.stripe_resp = data['display_message'];
          }
        })

  }

  //Pass in parameters for id, and index
  rejectMerchant(merchant_id, merchant_index){
    var reject = this._httpService.rejectMerchant(localStorage.getItem('userID'), merchant_id)
    reject.subscribe(data=>{
      console.log("inside reject merchant");
      if(data['success'] == -1){
        console.log("server error");
        return;
      }
      else if(data['success'] == 0){
        console.log("Unable to reject this merchant");
        return;
      }
      else if(data['success'] == 1){
        this.pending.splice(merchant_index, 1);
        for(var i=0;i<this.pending.length;i++){
          this.pending[i]['index'] = i;
        }
        console.log("Merchant successfully rejected");
      }
    })
  }

  revokeMerchant(merchant_id, merchant_index){
    var revoke = this._httpService.revokeMerchant(localStorage.getItem('userID'), merchant_id)
    revoke.subscribe(data=>{
      console.log("inside revoke merchant")
      if(data['success']==-1){
        console.log("server error")
        return
      }
      else if(data['success']==0){
        console.log("Unable to revoke merchant")
      }
      else{
        this.active.splice(merchant_index, 1);
        for(var i=0; i<this.active.length; i++){
          this.active[i]['index']=i
        }
      }
    })
    console.log("Merchant successfully revoked");
  }

  formatDate(date){
    //this.date = date;
    //this.date = this.merchants['updatedAt'];
    var d = new Date(date)
    var am = 'AM'
    var hour = d.getUTCHours()
    var minutes=d.getUTCMinutes()
    var min=''
    //console.log(d.getUTCHours())
    if(hour === 0){
      hour = 12
    }
    else if(hour >= 12){
      am = 'PM'
      if(hour > 12){
        hour = hour - 12
      }
    }
    if(minutes<10){
      min='0'
    }
    this.date = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + hour + ':' + min + d.getUTCMinutes() + ' ' + am
    return this.date;
  }
}
