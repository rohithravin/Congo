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

  constructor(private _httpService:HttpService, private _router:Router) {
    this.errMessage = '';
    this.merchants = [];
    this.pending = [];
    this.active = [];
    this.date = '';
    this.counter = 0;
  }

  ngOnInit() {
    this.fetchPending();
    this.fetchActive();
  }

  fetchPending(){
    var p = this._httpService.getPendingMerchants()
    p.subscribe(data=>{
      console.log("Response:", data)
      // console.log("inside ngOnInit")
      if(data['success'] == -1){
        // this.errMessage = "Server error";
        console.log("server error")
        return;
      }
      else if(data['success'] == 1){
          console.log("backend1");
          this.pending = data['merchants'];
          //No need to do this filter
          // if(this.merchants.length > 0){
          //   this.pending = data['merchants']['approved'].filter('false');
          // }
          //Add some value index into here
          //this.pending.index = this.counter;
          //this.counter++;
          for(var i=0;i<this.pending.length;i++){
            this.pending[i]['index'] = i;
          }
          //console.log(this.merchants);
          console.log(this.pending);
      }
    })
  }

  fetchActive(){
    var a = this._httpService.getActiveMerchants()
    a.subscribe(data=>{
      console.log("Response:", data)
      if(data['success'] == -1){
        console.log("server error");
        return;
      }
      else if(data['success'] == 1){
        console.log("backend2");
        this.merchants = data['merchants'];
        //this.merchants = data['merchants'];
        // if(this.merchants.length > 0){
        //   this.active = data['merchants']['approved'].filter('true');
        // }
        this.merchants.index = this.counter;
        this.counter++;
        console.log(this.merchants);
        console.log(this.active);
      }
    })
  }

  //Add paremeter here, add index too, so you dont have to do the for loop
  approveMerchant(merchant_id, merchant_index){
    //Get merchant id from parameter
    var approve = this._httpService.approveMerchant(localStorage.getItem('userID'), merchant_id)
    approve.subscribe(data=>{
      console.log("inside approve merchant");
      if(data['success'] == -1){
        console.log("server error");
        return;
      }
      else if(data['success'] == 0){
        console.log("Unable to approve this merchant");
        return;
      }
      else if(data['success'] == 1){
        //Get rid of this, remove from pending list, and move to approved list
        //this.merchants[this.counter].approved = true;
        var temp = this.pending[merchant_index];
        this.pending.splice(merchant_index, 1);
        this.active.push(temp);
        console.log("Merchant successfully approved");
      }
      //console.log(this.merchants);
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
        //for(var i=this.merchants.length - 1; i >= 0; --i){
          //if(this.merchants[i].userID == localStorage.getItem('userID')){
        //var temp = this.pending[merchant_index];
        this.pending.splice(merchant_index, 1);
        //this.pending.push(temp);
            //break;
          //}
        //}
        console.log("Merchant successfully rejected");
        //this.ngOnInit();
      }
      //this.merchants['approved'] = false;
    })
  }

  revokeMerchant(merchant_id, merchant_index){
    var revoke = this._httpService.revokeMerchant(localStorage.getItem('userID'), merchant_id)
    revoke.subscribe(data=>{
      console.log("inside revoke merchant")
    })
    //TODO: remove merchant from array
    //for(var i=this.merchants.length - 1; i >= 0; --i){
      //if(this.merchants[i].userID == localStorage.getItem('userID')){
        var temp = this.active[merchant_index];
        this.active.splice(merchant_index, 1);
        this.pending.push(temp);
        //break;
      //}
    //}
    console.log("Merchant successfully revoked");
    //this.ngOnInit();
  }

  formatDate(date){
    //this.date = date;
    //this.date = this.merchants['updatedAt'];
    var d = new Date(date)
    var am = 'AM'
    var hour = d.getUTCHours()
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
    this.date = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + hour + ':' + d.getUTCMinutes() + ' ' + am
    return this.date;
  }
}
