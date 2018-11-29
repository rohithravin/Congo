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
  prodOne:any
  prodTwo:any
  prodThree:any
  showOne:boolean
  showTwo:boolean
  showThree:boolean
  constructor(private _httpService:HttpService, private _router:Router) {
    this.totalSold=0;
    this.totalBillings=0
    this.products=[]
    this.prodOne={'num_sold':-1}
    this.prodTwo={'num_sold':-1}
    this.prodThree={'num_sold':-1}
    this.showOne=false
    this.showTwo=false
    this.showThree=false
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
      if(this.products.length>=1){
        this.showOne=true;
      }
      if(this.products.length>=2){
        this.showTwo=true
      }
      if(this.products.length>2){
        this.showThree=true;
      }
      for(var i=0; i<this.products.length; i++){
        this.totalSold+=this.products[i]['num_sold']
        this.totalBillings+=(this.products[i]['num_sold'] * this.products[i]['price'])
        var thisItem=this.products[i]
        if(thisItem['num_sold']>this.prodOne['num_sold']){
          this.prodThree=this.prodTwo
          this.prodTwo=this.prodOne
          this.prodOne=thisItem
        }
        else if(thisItem['num_sold']>this.prodTwo['num_sold']){
          this.prodThree=this.prodTwo
          this.prodTwo=thisItem
        }
        else if(thisItem['num_sold']>this.prodThree['num_sold']){
          this.prodThree=thisItem
        }
      }
      this.totalBillings=Math.floor(this.totalBillings*100)/100
    })

  }

}
