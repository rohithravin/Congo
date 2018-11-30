import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-merchantproduct',
  templateUrl: './merchantproduct.component.html',
  styleUrls: ['./merchantproduct.component.css']
})
export class MerchantProductComponent implements OnInit {
  checkEdit:boolean;
  randomProductID:string;
  products:any;
  constructor(private _httpService: HttpService,private _router:Router) {
      this.checkEdit = false;
      this.products=[]
  }
  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')==null || localStorage.getItem('merchantLoggedIn')=='false'){
      return this._router.navigate(['']);
    }
    else if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      return this._router.navigate(['']);
    }
    this.fetchAllProducts()
  }
  edit(item){
        //console.log("we are in edit(item)");
        localStorage.setItem('checkEdit','true');
        this.checkEdit = false;
        localStorage.setItem('randomProductID', item);
      //  console.log("checkpoint 1");
        //this.checkEdit = true;
        //console.log("checkpoint 2");
        this._router.navigate(['dummyAdd']);
        //this.cart = localStorage.getItem("items");
  }
  editAlt(productID){
      localStorage.setItem('checkEdit', 'true')
      localStorage.setItem('editProdID', productID)
      this._router.navigate(['merchantadd'])
  }
  fetchAllProducts(){
    this.products=[]
    var license=localStorage.getItem('licenseNo')
    var productsObs=this._httpService.fetchMerchantProducts(license)
    productsObs.subscribe(data=>{
      console.log("Recieved response:", data)
      this.products=data['products']
    })
  }
  changeProductState(productID){
    var license=localStorage.getItem('licenseNo')
    var stateObs=this._httpService.changeProductState(productID, license)
    stateObs.subscribe(data=>{
      console.log("Recieved response:", data)
      if(data['success']==1){
        this.fetchAllProducts()
        // for(var product in this.products){
        //     if(product['_id']==productID){
        //       product['active']=data['product']['active']
        //     }
        // }

      }
      else{
        
      }
    })
  }
}
