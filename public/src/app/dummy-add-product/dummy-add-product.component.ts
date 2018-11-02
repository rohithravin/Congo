import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-dummy-add-product',
  templateUrl: './dummy-add-product.component.html',
  styleUrls: ['./dummy-add-product.component.css']
})
export class DummyAddProductComponent implements OnInit {

  product:any;
  newProduct:any
  image_name:string;
  images:any;
  images_size:number;
  showErr_name:boolean;
  showErr_description:boolean;
  showErr_image:boolean;
  showErr_price:boolean;
  showErr_size:boolean;
  showErr_color:boolean;
  showErr_tag:boolean;
  showErr_category:boolean;
  edit:boolean;
  addEditTitle:string
  editID:string

  constructor(private _httpService: HttpService, private _router:Router) {
    this.showErr_name = false;
    this.showErr_description = false;
    this.showErr_image = false;
    this.showErr_price = false;
    this.showErr_size = false;
    this.showErr_color = false;
    this.showErr_tag = false;
    this.showErr_category = false;
    this.images = {};
    this.images[0] = "Enter Image";
    this.images_size = 0;
    this.newProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:'', category:''}
    this.edit=false
    this.addEditTitle='Add'
    this.editID='-1'
    
    if(localStorage.getItem('checkEdit')!=null && localStorage.getItem('checkEdit')=='true'){
      this.edit=true;
      this.editID=localStorage.getItem('editProdID')
      localStorage.removeItem('checkEdit')
      localStorage.removeItem('editProdID')
      this.addEditTitle='Edit'
      this.fetchProduct()
    }
  
  }

  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')==null || localStorage.getItem('merchantLoggedIn')=='false'){
      this._router.navigate(['']);
    }
    else if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['']);
    }
  }

  fetchProduct(){
    var productObs=this._httpService.fetchProduct(this.editID)
    productObs.subscribe(data=>{
      if(data['success']!=1){
        return this._router.navigate(['dummyAdd'])
      }
      else{
        var product=data['product']
        console.log("Product:", product)
        console.log("License:", localStorage.getItem('licenseNo'))
        var tags=product.tags[0]
        for(var i=1; i<product.tags.length; i++){
          tags+=','
          tags+=product.tags[i]
        }
        var colors=product.colors[0]
        for(var i=1; i<product.colors.length; i++){
          colors+=','
          colors+=product.colors[i]
        }
        var sizes=product.sizes[0]
        for(var i=1; i<product.sizes.length; i++){
          sizes+=','
          sizes+=product.sizes[i]
        }
        this.newProduct={name:product.name, description:product.description, image:product.images[0], price:product.price, size:sizes, color:colors, tag:tags, category:product.category}
      }
    })
  }

  // updateCountPlus(){
  //   if(this.image_name){
  //   console.log(this.image_name);
  //   this.images[this.images_size] = this.image_name;
  //   this.images_size++;
  //   this.showErr_image = false;
  //   }else{
  //     this.showErr_image = true;
  //   }
  // }

  createProduct(){
    this.showErr_name=false
    this.showErr_description = false;
    this.showErr_price = false;
    this.showErr_size = false;
    this.showErr_color = false;
    this.showErr_tag = false;
    this.showErr_category = false;

    if(this.newProduct.name.length < 2 ){
      this.showErr_name = true;
    }
    if(this.newProduct.description.length < 2 ){
      this.showErr_description = true;
    }
    if(this.newProduct.price.length < 3){
      this.showErr_price = true;
    }
    if( this.newProduct.size.length < 1 ){
      this.showErr_size = true;
    }
    if( this.newProduct.color.length < 2 ){
      this.showErr_color = true;
    }
    if( this.newProduct.tag.length < 2 ){
      this.showErr_tag = true;
    }
    if( this.newProduct.category.length < 2 ){
      this.showErr_category = true;
    }

    if(!this.showErr_tag && !this.showErr_name && !this.showErr_size && !this.showErr_image && !this.showErr_price && !this.showErr_color && !this.showErr_description && !this.showErr_category){
      var splitSizes=this.newProduct.size.split(",")
      var splitColors=this.newProduct.color.split(",")
      var splitTags=this.newProduct.tag.split(",")
      this.newProduct.size=splitSizes
      this.newProduct.color=splitColors
      this.newProduct.tag=splitTags
      var err=this._httpService.createDummyProduct(this.newProduct, localStorage.getItem('licenseNo'));
      err.subscribe(data=>{
        console.log("Received response:", data)
        if(data['success']==-1){
            //Server error
            return;
        }else if(data['success']==0){
            //client error,check message;
            return;
        }else{
            //localStorage stuff?
            this.newProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:''};
        }
      })
    }
  }

  editProduct(){
    //IMPORTANT Split fields by commas
    console.log("Editing product")
    var editObs=this._httpService.editProduct(localStorage.getItem('licenseNo'), this.newProduct, this.editID)
    editObs.subscribe(data=>{
      console.log("Response:", data)
      if(data['success']==1){
        return this._router.navigate(['/merchant/products'])
      }
    })
  }
}
