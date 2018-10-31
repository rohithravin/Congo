import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productID:string;
  product:any;
  count:number;
  size:string;
  color:string;
  showErr_quantity:boolean

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.productID = '';
    this.product={};
    this.count = 1;
    this.size='';
    this.color='';
    this.showErr_quantity = false;
  }

  ngOnInit() {
    this._activaterouter.params.subscribe(
      params=>{
        this.productID = params['pid'];
        console.log('productID: ' + this.productID);
      })
    this.fetchProduct()

  }

  updateCountPlus(){
    this.count = this.count + 1;
  }

  updateCountMinus(){
    if (this.count > 1){
      this.count = this.count - 1;
    }
  }

  fetchProduct(){
    console.log("Inside this Product function")
    var product=this._httpService.fetchProduct(this.productID)
    product.subscribe(data=>{
      console.log(data)
      if(data['success']==0 || data['success']==-1){
        this._router.navigate([''])
        return;
      }
      this.product = data['product'];
      this.size=data['product']['sizes'][0]
      this.color=data['product']['colors'][0]
    })
  }

  addToCart(){
    console.log("Adding to cart")
    if(localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['login'])
      return;
    }
    if(this.count > this.product['quantity']){
      console.log("can't buy that many")
      this.showErr_quantity = true;
    }else{
      this.showErr_quantity = false;
    var productDetails={product:this.product, size:this.size, color:this.color, quantity:this.count}
    var addCartObs=this._httpService.addToCart(productDetails, localStorage.getItem('userID'))
    addCartObs.subscribe(data=>{
      console.log(data)
      if(data['success']==1){
        this._router.navigate(['cart'])
      }
    })
  }
  }

}
