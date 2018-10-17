import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart:any;
  userID:string
  constructor(private _httpService:HttpService, private _router:Router) { 
    this.cart={}
    this.userID=localStorage.getItem('userID')
  }

  ngOnInit() {
    this.fetchCart()
  }
  fetchCart(){
    if(localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['login'])
    }
    var userID=localStorage.getItem('userID')
    var cartObs=this._httpService.fetchCart(this.userID)
    cartObs.subscribe(data=>{
      console.log(data)
      console.log(this.userID)
      if(data['success'] =! 1){
        this._router.navigate([''])
      }
      this.cart=data['cart']
      console.log(this.cart)
    })
  }

}
