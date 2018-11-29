import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-orders',
  templateUrl: './merchant-orders.component.html',
  styleUrls: ['./merchant-orders.component.css']
})
export class MerchantOrdersComponent implements OnInit {
  license:String
  items:any
  constructor(private _httpService:HttpService, private _router:Router) {
    this.license=''
    this.items=[]
  }

  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')==null || localStorage.getItem('merchantLoggedIn')=='false'){
      return this._router.navigate(['']);
    }
    else if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      return this._router.navigate(['']);
    }
    this.license=localStorage.getItem('licenseNo')
    this.getOrders()
  }
  getOrders(){
    var ordersObs=this._httpService.fetchMerchantOrders(this.license)
    ordersObs.subscribe(data=>{
      console.log("Response:", data)
      if(data['success']==0 || data['success']==-1){
        console.log("Failed to fetch")
      }
      if(data['success']==1){
        this.items=data['items']
      }
    })
  }

}
