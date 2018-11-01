import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {
  userID:any;
  orders:any;

  constructor(private _httpService:HttpService,private _router:Router) { 
    this.userID = localStorage.getItem('userID');
    this.orders = [];
  }

  ngOnInit() {
    this.getUserOrders();
  }


  getUserOrders(){
    if(localStorage.getItem('loggedIn') == 'false'){
      this._router.navigate(['login']);
    }
    var orderObs=this._httpService.getOrders(this.userID);
    orderObs.subscribe(data=>{
      if(data['success'] != 1){
        console.log("error");
      }else{
      this.orders = data['orders'];
      console.log(this.orders);
      }
    })
  }
}
