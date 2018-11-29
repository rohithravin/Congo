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
  num_items:number;

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.orderid = '';
    this.userid = localStorage.getItem('userID');
    this.order = [];
    this.total = 0;
    this.num_items=0;
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
    var orderObs=this._httpService.getOrder(this.userid, this.orderid);
    orderObs.subscribe(data=>{
      if(data['success'] != 1){
        console.log(data['message']);
      }else{
        // console.log(data);
        this.order = data['items'];
        console.log(this.order)
        this.total = data['total']
        this.total=Math.floor(this.total * 100) / 100;
        for(var i=0; i<this.order.length; i++){
        // for(var item in this.order)
          var quantity=this.order[i]['quantity']
          // console.log("item:", this.order[i])
          // this.num_items+=this.order[i]['quantity']
          // console.log("quantity:", quantity)
          this.num_items+=quantity
        }
        // console.log(this.order);
      }
    })

  }

}
