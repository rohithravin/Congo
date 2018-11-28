import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-checkout-conf',
  templateUrl: './checkout-conf.component.html',
  styleUrls: ['./checkout-conf.component.css']
})
export class CheckoutConfComponent implements OnInit {
  subTotal:any;
  shipping:any;
  total:any;
  orderID:string;

  constructor(private _router:Router,private _httpService:HttpService) {
    this.orderID = localStorage.getItem('_COID');
    this.subTotal = 0;
    this.shipping = 0;
    this.total = 0;
   }

  ngOnInit() {
    this.fetchOrder();
  }

  fetchOrder(){
    console.log(this.orderID);
    if(this.orderID){
      localStorage.removeItem("_COID");
    }
    this.subTotal = localStorage.getItem('_st');
    if(this.subTotal){
      localStorage.removeItem('_st');
    }
    this.total = localStorage.getItem('_t');
    if(this.total){
      localStorage.removeItem('_t');
    }
    this.shipping = localStorage.getItem('_s');
    if(this.shipping){
      localStorage.removeItem('_s');
    }
      
  }
}
