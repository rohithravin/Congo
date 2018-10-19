import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart:any;
  userID:string
  subtotal: number
  constructor(private _httpService:HttpService, private _router:Router) { 
    this.cart={}
    this.userID=localStorage.getItem('userID');
    this.subtotal = 0;
  }

  ngOnInit() {
    this.fetchCart()
  }
  fetchCart(){
    if(localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['login'])
    }
    console.log(this.userID)
    var cartObs=this._httpService.fetchCart(this.userID)
    cartObs.subscribe(data=>{
      console.log(data)
      // console.log(this.userID)
      if(data['success'] =! 1){
        this._router.navigate([''])
      }
      this.cart=data['cart']
      //console.log(this.cart)
      this.getTotal()
    })
  }
  getTotal(){
    var i=0;
    while(i<this.cart['items'].length){
      //console.log('in loop');
      this.subtotal+=parseFloat(this.cart['items'][i]['product']['price']) * parseInt(this.cart['items'][i]['quantity']);
      console.log(this.subtotal);
      i++;
    }
    //console.log(this.subtotal);
    return this.subtotal;
  }
}
