import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-merchantproduct',
  templateUrl: './merchantproduct.component.html',
  styleUrls: ['./merchantproduct.component.css']
})
export class MerchantProductComponent implements OnInit {
  // currProduct:any
  constructor(private _httpService: HttpService) { 
   
  }
  ngOnInit() {
    // this.currProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:'', category:''}
  }
  setImage(image){
    // this.currProduct={image:image}
  }
  setSize(size){
    // this.currProduct={size:size}
  }
  setColor(color){
    // this.currProduct={color:color}
  }
  setTag(tag){
    // this.currProduct={tag:tag}
  }
  setCategory(category){
    // this.currProduct={category:category}
  }
  edit(item){
    
  }
  remove(item){

  }
  promote(item){

  }
  setProduct(){
    // var setObs=this._httpService.createDummyProduct(this.currProduct)
    // setObs.subscribe(data=>{
    //   console.log("Received response:", data)
    // })
    // this.currProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:''}
  }
}
