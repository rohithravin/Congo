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

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService) {
    this.productID = '';
  }

  ngOnInit() {
    this._activaterouter.params.subscribe(
      params=>{
        this.productID = params['pid'];
        console.log('productID: ' + this.productID);
      })
    this.fetchProduct()
  }

  fetchProduct(){
    console.log("Inside this Product function")
    var featuredObs=this._httpService.fetchProduct()
    featuredObs.subscribe(data=>{
      console.log(data)
    })
  }

}
