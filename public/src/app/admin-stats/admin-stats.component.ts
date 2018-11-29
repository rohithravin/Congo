import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.css']
})
export class AdminStatsComponent implements OnInit {
  visits:number
  transactions:number
  billings:number
  orders:any
  constructor(private _httpService:HttpService, private _router:Router) {
    this.visits=0
    this.transactions=0
    this.billings=0
    this.orders=[]
  }

  ngOnInit() {
    if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      return this._router.navigate([''])
    }
    if(localStorage.getItem('adminLoggedIn')==null || localStorage.getItem('adminLoggedIn')=='false'){
      return this._router.navigate([''])
    }
    this.fetchVisits();
    this.fetchOrders();

  }
  fetchVisits(){
    var obs=this._httpService.getVisits()
    obs.subscribe(data=>{
      console.log("Visits:",data)
      this.visits=data['visits']
    })
  }
  fetchOrders(){
    var obs=this._httpService.getAllOrders(localStorage.getItem('userID'))
    obs.subscribe(data=>{
      console.log("Orders:", data)
      this.orders=data['orders']
      this.transactions=this.orders.length
      for(var i=0; i<this.orders.length; i++){
        this.billings+=this.orders[i].total
      }
      this.billings=Math.floor(this.billings*100)/100
    })
  }

}
