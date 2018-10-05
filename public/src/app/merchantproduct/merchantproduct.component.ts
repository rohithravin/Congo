import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-merchantproduct',
  templateUrl: './merchantproduct.component.html',
  styleUrls: ['./merchantproduct.component.css']
})
export class MerchantproductComponent implements OnInit {
  products: any;
  merchant: string;
  star: string;

  constructor(private _Activatedroute: ActivatedRoute, private _router:Router, private _httpService:HttpService) { 
    this.products = {};
    this.star = "checked"
  }

  ngOnInit() {
    this._Activatedroute.params.subscribe(
      params => {
        this.merchant =params['merchant']
        console.log(this.merchant);
        this.fetchMerchantProducts();
      });
  }

  fetchMerchantProducts(){
    var productsObs=this._httpService.fetchMerchantProducts(this.merchant)
    productsObs.subscribe(data=>{
      console.log("Queried products: ", data)
      this.products = data['products'];
      this.merchantproduct_logic();
    })
  }

  private merchantproduct_logic (){
    console.log(this.products);
  }
}
