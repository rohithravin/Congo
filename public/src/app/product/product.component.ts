import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService) {
    this.productID = '';
    this.product={};
    this.count = 0;
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
    if (this.count > 0){
      this.count = this.count - 1;
    }
  }

  fetchProduct(){
    console.log("Inside this Product function")
    var product=this._httpService.fetchProduct(this.productID)
    product.subscribe(data=>{
      console.log(data)
      this.product = data['product'];
    })

  }

}
