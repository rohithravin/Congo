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
  tax:number
  shipping:number
  total:number
  alertMessage:string
  showAlert:boolean
  showAlertFail:boolean
  showCartEmpty:boolean
  constructor(private _httpService:HttpService, private _router:Router) {
    this.cart={}
    this.userID=localStorage.getItem('userID');
    this.subtotal = 0;
    this.tax = 0.0925;
    this.shipping = 5.99;
    this.total = 0;
    this.alertMessage = "Successfully removed product";
    this.showAlert = false;
    this.showAlertFail = false;
    this.showCartEmpty = false;

    //this.fetchCart()
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
     var item_leng = data['cart']['items'].length;
      if (item_leng == 0){
        this.showCartEmpty = true;
        this.subtotal = 0;
        this.tax = 0;
        this.shipping = 0;
        this.total = 0;
      }else{
        this.showCartEmpty = false;
      this.subtotal = this.getSubtotal();
      this.tax = this.getTax();
      this.shipping = this.getShipping();
      this.total = this.getTotal();
      }
    })

  }

  removeProduct(productID,productName){
    if(confirm("Remove from Cart")){
      console.log("remove: " + productID);
      var removeProductObs = this._httpService.removeProductFromCart(this.userID,productID);
      removeProductObs.subscribe(data=>{
        if(data['success'] == 1){
        this.subtotal = 0;
        this.tax = 0;
        this.shipping = 0;
        this.total = 0;
        this.fetchCart();
        this.showAlert = true;
        this.alertMessage = "Successfully removed "+productName;
        }else if (data['success'] == -1){
          this.showAlertFail = true;
          this.alertMessage = "Server Error Try again later"
        }
      })
    }
  }

  checkout(){
    if(!this.showCartEmpty){
      this._router.navigate(['/checkout']);
    }
  }

  getTotal(){
       this.total = this.subtotal + this.tax + this.shipping;
       //console.log("Total: ", this.total.toFixed(2));
       this.total = Math.floor(this.total * 100) / 100;
       return this.total;
  }
  getShipping(){
        this.shipping = 5.99;
        //console.log("Shipping & handling: ", this.shipping);
       this.shipping =  Math.floor(this.shipping * 100) / 100;
        return this.shipping;
  }
  getTax(){
    this.tax = this.subtotal * 0.08;
    //console.log("tax: ", this.tax);
    this.tax = Math.floor(this.tax * 100) / 100;
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
    this.subtotal = Math.floor(this.subtotal * 100) / 100;
    return this.subtotal;
  }
}
