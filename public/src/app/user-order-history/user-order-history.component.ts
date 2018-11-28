import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-user-order-history',
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.css']
})
export class UserOrderHistoryComponent implements OnInit {

  orderid:string;
  userid:string;
  order:any;
  total:number;

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.orderid = '';
    this.userid = localStorage.getItem('userID');
    this.order = [];
    this.total = 0;

  }

  ngOnInit() {
    this._activaterouter.params.subscribe(
      params=>{
        this.orderid = params['orderid'];
        console.log('orderid: ' + this.orderid);
      })
      console.log('userid: ' + this.userid);
      this.getOrder();
  }


  getOrder(){
    console.log("Order ID before server call:", this.orderid)
    var order=this._httpService.getOrder(this.userid, this.orderid);
    order.subscribe(data=>{
      if(data['success'] != 1){
        console.log(data['message']);
      }else{
        console.log(data);
        this.order = data['items'];
        this.total = data['total']
        console.log(this.order);
      }
    })

  }

}
