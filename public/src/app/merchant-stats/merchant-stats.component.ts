import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-stats',
  templateUrl: './merchant-stats.component.html',
  styleUrls: ['./merchant-stats.component.css']
})
export class MerchantStatsComponent implements OnInit {
  totalSold:number;
  totalBillings:number;
  products:any
  constructor(private _httpService:HttpService, private _router:Router) {
    this.totalSold=0;
    this.totalBillings=0
    this.products=[]
   }

  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')==null || localStorage.getItem('merchantLoggedIn')=='false'){
      this._router.navigate(['']);
    }
    else if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['']);
    }
    this.getAllProducts();
  }
  getAllProducts(){
    var license=localStorage.getItem('licenseNo')
    var productObs=this._httpService.getMerchantProducts(license)
    productObs.subscribe(data=>{
      console.log("Response:", data)
      this.products=data['products']
      for(var i=0; i<this.products.length; i++){
        this.totalSold+=this.products[i]['num_sold']
        this.totalBillings+=(this.products[i]['num_sold'] * this.products[i]['price'])
      }
      this.totalBillings=Math.floor(this.totalBillings*100)/100
    })

  }

}
