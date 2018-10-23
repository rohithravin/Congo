import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

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
  isTrue:string
  edit:boolean;

  randomProductID:string;
  constructor(private _httpService: HttpService, private _router:Router) {
        this.product = {};
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
        this.isTrue = 'true';
        this.randomProductID = localStorage.getItem('randomProductID');
        console.log(this.randomProductID);
        //this.edit = true;

        if(localStorage.getItem('checkEdit') != null){
            console.log("check 1")
            this.edit = (this.isTrue == localStorage.getItem('checkEdit'));
            console.log("check 2");
            localStorage.setItem('checkEdit', 'false');
      }else{
            console.log("check false");
            this.edit = false;
      }


        //console.log("edit: ", this.edit);
  }
  ngOnInit() {
        if(this.edit){
              this.fetchProduct();
        }else{
              this.newProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:'', category:''}
        }

  }

  fetchProduct(){
        console.log("in fetch");
        if(localStorage.getItem('loggedIn')=='false'){
             this._router.navigate(['login']);
        }

        var productObs=this._httpService.fetchProduct(this.randomProductID);
        productObs.subscribe(data=>{
             console.log(data);

             if(data['success'] != 1){
                   this._router.navigate(['']);
             }

             this.product =data['product'];
             console.log("hi");
             console.log(this.product['name']);
             this.product['category'] = 'hat';
             //this.editProduct={name:product['name'], description:product['description'], image:product['images'][0], price:product['price'], size:product['sizes'], color:product['colors'][0], tag:product['tags'][0], category:''}

        })
  }

  updateCountPlus(){
    if(this.image_name){
    console.log(this.image_name);
    this.images[this.images_size] = this.image_name;
    this.images_size++;
    this.showErr_image = false;
    }else{
      this.showErr_image = true;
    }
  }


  addImage(image){
    this.newProduct={image:image}
  }
  addSize(size){
    this.newProduct={size:size}
  }
  addColor(color){
    this.newProduct={color:color}
  }
  addTag(tag){
    this.newProduct={tag:tag}
  }
  addCategory(category){
    this.newProduct={category:category}
  }
  createProduct(){
    // var createObs=this._httpService.createDummyProduct(this.newProduct)
    // createObs.subscribe(data=>{
    //   console.log("Received response:", data)
    // })
    // this.newProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:''}



   /* var splitImage = image.split(",");
    splitTag.forEach((item, index) => {
          console.log("index: ", index);
          console.log("image: ", item);
    });*/



    if(this.newProduct.name.length < 2 ){
      this.showErr_name = true;
      console.log("check name");
    }else{
      this.showErr_name = false;
    }

    if(this.newProduct.description.length < 2 ){
      this.showErr_description = true;
      console.log("check description");
    }else{
      this.showErr_description = false;
    }

    if(this.newProduct.price.length < 3){
      this.showErr_price = true;
      console.log("check price");
    }else{
      this.showErr_price = false;
    }
    if( this.newProduct.size.length < 5 ){
      this.showErr_size = true;
      console.log("check size");
    }else{
      this.showErr_size = false;
    }

    if( this.newProduct.color.length < 2 ){
      this.showErr_color = true;
      console.log("check color");
    }else{
      this.showErr_color = false;
    }

    if( this.newProduct.tag.length < 2 ){
      this.showErr_tag = true;
      console.log("check tag");
    }else{
      this.showErr_tag = false;
    }

    if( this.newProduct.category.length < 2 ){
      this.showErr_category = true;
      console.log("check 6");
    }else{
      this.showErr_category = false;
    }


    if(!this.showErr_tag && !this.showErr_name && !this.showErr_size && !this.showErr_image && !this.showErr_price && !this.showErr_color && !this.showErr_description && !this.showErr_category){
          var err=this._httpService.createDummyProduct(this.newProduct);
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
            }
          })
          this.newProduct={name:'', description:'', image:'', price:'', size:'', color:'', tag:''};
          console.log("Successfully added product!!");
    }else{
          console.log("error! didn't add product.");

    }



/*    var splitSize = this.newProduct.size.split(",");
    splitSize.forEach((item, index) => {
          console.log("index: ", index);
          console.log("size: ", item);
    });

    var splitColor = this.newProduct.color.split(",");
    splitColor.forEach((item, index) => {
          console.log("index: ", index);
          console.log("color: ", item);
    });

    var splitTag = this.newProduct.tag.split(",");
    splitTag.forEach((item, index) => {
          console.log("index: ", index);
          console.log("tag: ", item);
    });*/


  }


}
