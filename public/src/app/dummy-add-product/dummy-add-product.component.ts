import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-dummy-add-product',
  templateUrl: './dummy-add-product.component.html',
  styleUrls: ['./dummy-add-product.component.css']
})
export class DummyAddProductComponent implements OnInit {
  newProduct:any
  constructor(private _httpService: HttpService) { 
   
  }
  ngOnInit() {
    this.newProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:''}
  }
  createProduct(){
    console.log('Created Product')
    var createObs=this._httpService.createDummyProduct(this.newProduct)
    createObs.subscribe(data=>{
      console.log("Recieved response:", data)
    })
    this.newProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:''}
  }

}
