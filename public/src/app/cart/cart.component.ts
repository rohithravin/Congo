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
<<<<<<< Updated upstream
  tax:number
  shipping:number
  total:number
  constructor(private _httpService:HttpService, private _router:Router) {
    this.cart={}
    this.userID=localStorage.getItem('userID');
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;
    //this.fetchCart()
=======
  tax: number
  shipping: number
  constructor(private _httpService:HttpService, private _router:Router) { 
    this.cart={}
    this.userID=localStorage.getItem('userID');
    this.subtotal = 0;
    this.tax = 0.0925;
    this.shipping = 5.99;
>>>>>>> Stashed changes
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

    })

    //this.getSubtotal();
    //this.getTax();
    //this.getShipping();
    //this.getTotal();

  }

  getTotal(){
       this.total = this.subtotal + this.tax + this.shipping;
       console.log("Total: ", this.total);
       return this.total;
  }
  getShipping(){
        this.shipping = 5.99;
        console.log("Shipping & handling: ", this.shipping);
        return this.shipping;
  }
  getTax(){
    this.tax = this.subtotal * 0.08;
    console.log("tax: ", this.tax);
    return this.tax;
  }

  getSubtotal(){
    var i=0;
    while(i<this.cart['items'].length){
      //console.log('in loop');
      this.subtotal+=parseFloat(this.cart['items'][i]['product']['price']) * parseInt(this.cart['items'][i]['quantity']);
      //console.log(this.subtotal);
      i++;
    }
    this.subtotal += 0.00;
    console.log("subtotal: ", this.subtotal);
    return this.subtotal;
  }
}
