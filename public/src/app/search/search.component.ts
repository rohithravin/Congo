import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService }  from '../http.service';  

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  products: Array<any>;
  searchQuery:string;
  filterSize;
  star:string;
  five_star_filter:boolean;
  three_four_star_filter:boolean;
  one_two_star_filter:boolean;
  popular_filter:boolean;
  low_high_filter:boolean;
  high_low_filter:boolean;
  /* these are the boolean filters */
  nameIdx:number;
  imagesIdx:number;
  priceIdx:number;
  ratingIdx:number;
  tagsIdx:number;
  //string to hold the categories shown
  categories:string;

  constructor(private _Activatedroute: ActivatedRoute, private _router:Router, private _httpService:HttpService ) {
    this.products = [];
    this.nameIdx = 0;
    this.imagesIdx = 1;
    this.priceIdx = 2;
    this.ratingIdx = 3;
    this.tagsIdx = 4;
    this.searchQuery = '';
    this.filterSize = 6;
    this.star = "checked";
    this.five_star_filter = false;
    this.three_four_star_filter= false;
    this.one_two_star_filter = false;
    this.popular_filter = false;
    this.low_high_filter = false;
    this.high_low_filter = false;
    this.categories ='';
  }

  ngOnInit() {
    this._Activatedroute.params.subscribe(
    params => {
      this.searchQuery =params['searchQuery']
      console.log(this.searchQuery);
      this.search_logic()
      this.clearFilter();
      this.fetchSearchedProducts();
    });
  }
  clearFilter(){
    this.five_star_filter =false;
    this.three_four_star_filter=false;
    this.one_two_star_filter =false;
    this.popular_filter = false;
    this.low_high_filter =false;
    this.high_low_filter =false;
    this.categories ='';
  }
  fetchSearchedProducts(){
    var productsObs=this._httpService.fetchSearchedProducts(this.searchQuery)
    productsObs.subscribe(data=>{
      console.log("Queried products: ", data)
    })
  }
  private search_logic (){
    console.log("starting search");
    //first thing is to call the getAllProducts service
    //then sort all of the products based on their rating
    //the product array of objects needs to add the price, product image, product name, and rating,productid.
    //decide how many products go on each page?
    //use products array
    /* console.log("Inside this function")
    var featuredObs=this._httpService.searchProduct()
    featuredObs.subscribe(data=>{
    console.log(data)
    }) */
    /*fake module to help plug in the backend */

    var _fakeCount = 0;
    console.log("products");
    while (_fakeCount < 10){
    var productTemp = {
    name: "",
    images: [],
    price: 0.00,
    rating: [],
    tags: []
    }
    productTemp.name = "Gucci slide";
    productTemp.images = ["https://cdn.shopify.com/s/files/1/2722/3942/products/pursuit_gucci_450.jpg?v=1523648003"];
    productTemp.price = 68.75;
    productTemp.rating = ["checked","checked","checked","checked",""]
    productTemp.tags = ["sandal","clout"];
    this.products.push(productTemp);
    _fakeCount++;
    }
    var _name ="Shoe";
    var _images = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRw0cvoP_FkHTy6oNaoTichOS9iXyCVjbnEFZYpz6cumR06w3q"];
    var _price =68.75;
    var _rating = ["checked","checked","","",""];
    var _tags = ["shoe","basketball"];
    /*productTemp.name = _name;
    productTemp.images = _images;
    productTemp.price = _price;
    productTemp.rating = _rating;
    productTemp.tags = _tags;
    console.log(productTemp);
    this.products.push(productTemp);*/
    /*productTemp.name = "Gucci slide";
    productTemp.images = ["https://cdn.shopify.com/s/files/1/2722/3942/products/pursuit_gucci_450.jpg?v=1523648003"];
    productTemp.price = 68.75;
    productTemp.rating = ["checked","checked","checked","checked",""]
    productTemp.tags = ["sandal","clout"];
    this.products.push(productTemp);*/
    console.log(this.products);
  }

  getSearchedProduct(){
    return this.searchQuery;
  }

  setFiveStarFilter(){
    this.five_star_filter = !this.five_star_filter;
  }


  searchFilter(){
    let filters:
    Array<boolean> = [];
    filters = this.getAllSearchFilters();
    console.log(filters);
    console.log("test");
  }

  setThreeFourStarFilter(){
    if (!this.three_four_star_filter){
      this.three_four_star_filter =
      true;
    }else {
      this.three_four_star_filter =
      false;
    }
  }

  setOneTwoStarFilter(){
    if (!this.one_two_star_filter){
      this.one_two_star_filter =
      true;
    }else {
      this.one_two_star_filter =
      false;
    }
  }

  setPopularFilter() {
    if (!this.popular_filter){
      this.popular_filter =
      true;
    }else {
      this.popular_filter =
      false;
    }
  }

  setLowHighFilter() {
    if (!this.low_high_filter){
      this.low_high_filter =
      true;
    }
    else {
      this.low_high_filter=
      false;
    }
  }

  setHighLowFilter() {
    if (!this.high_low_filter){
      this.high_low_filter =
      true;
    }else {
      this.high_low_filter =
      false;
    }
  }

  public getAllSearchFilters () {
    let filters:
    Array<boolean> = [];
    //if more filters are added then filter size must be changed
    filters.push(this.five_star_filter);
    filters.push(this.three_four_star_filter);
    filters.push(this.one_two_star_filter);
    filters.push(this.popular_filter);
    filters.push(this.low_high_filter);
    filters.push(this.high_low_filter);
    if (filters.length !=
      this.filterSize ){
      //error
    }
    return filters;
  }
}