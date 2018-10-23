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
  checkEdit:boolean
  randomProductID:string
  //cart:any
  constructor(private _httpService: HttpService,private _router:Router) {
      this.checkEdit = false;
      //this.cart = {};
  }
  ngOnInit() {

    // this.currProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:'', category:''}
  }
  setImage(image){
    // this.currProduct={image:image}

    /*this._Activatedroute.params.subscribe(
      params => {
        this.searchQuery =params['searchQuery']
        console.log(this.searchQuery);
        this.fetchProduct();
      });
    this.currProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:'', category:''}*/
  }
  /*setImage(image){
    this.currProduct={image:image}
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
}*/
  addProduct(){
        this._router.navigate(['dummyAdd']);
  }
  edit(item){
        //console.log("we are in edit(item)");
        localStorage.setItem('checkEdit','true');
        this.checkEdit = false;
        localStorage.setItem('randomProductID', item);
      //  console.log("checkpoint 1");
        //this.checkEdit = true;

        if(localStorage.getItem('loggedIn')=='false'){
             this._router.navigate(['login']);
        }
        //console.log("checkpoint 2");

        this._router.navigate(['dummyAdd']);

        //this.cart = localStorage.getItem("items");

  }/*
  remove(item){

  }
  promote(item){

  }
  setProduct(){
    var setObs=this._httpService.createDummyProduct(this.currProduct)
    setObs.subscribe(data=>{
      console.log("Received response:", data)
    })
    this.currProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:''}
}*/
>>>>>>> Stashed changes
}
