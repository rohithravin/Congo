import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService }  from '../http.service';
import { last } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  products: any;
  fiveStarProducts:any;
  searchQuery:string;
  filterSize;
  star:string;
  five_star_filter:boolean;
  high_low_star_filter:boolean;
  low_high_star_filter:boolean;
  popular_filter:boolean;
  low_high_filter:boolean;
  high_low_filter:boolean;
  /* these are the boolean filters */
  show_noProducts:boolean;
  show_normalProducts:boolean;
  show_fiveStarProducts:boolean;
  num_results:number;
  current_page:number;
  page_results:number;
  /**************************
   * TODO: fix the top so there isnt as much space
   * 21 on a page
   * 
   */

  constructor(private _Activatedroute: ActivatedRoute, private _router:Router, private _httpService:HttpService ) {
    this.products = {};
    this.fiveStarProducts = {};
    this.show_normalProducts = false;
    this.show_fiveStarProducts = false;
    this.searchQuery = '';
    this.filterSize = 6;
    this.star = "checked";
    this.five_star_filter = false;
    this.high_low_star_filter= false;
    this.low_high_star_filter = false;
    this.popular_filter = false;
    this.low_high_filter = false;
    this.high_low_filter = false;
    this.show_noProducts = false;
    this.num_results = 0;
    this.page_results = 1;
    this.current_page = 1;
  }

  ngOnInit() {
    this._Activatedroute.params.subscribe(
    params => {
      this.searchQuery =params['searchQuery']
      console.log(this.searchQuery);
      if(localStorage.getItem('categoryClicked') == 'true'){
            //console.log('in search: ',localStorage.getItem('category'));
            this.fetchCategorySearchedProducts(localStorage.getItem('category'));
            this.five_star_filter = false;
            this.high_low_star_filter= false;
            this.low_high_star_filter = false;
            this.popular_filter = false;
            this.low_high_filter = false;
            this.high_low_filter = false;
      }else{
            this.fetchSearchedProducts();
            this.five_star_filter = false;
            this.high_low_star_filter= false;
            this.low_high_star_filter = false;
            this.popular_filter = false;
            this.low_high_filter = false;
            this.high_low_filter = false;
      }
    });
  }
 
  fetchSearchedProducts(){
    console.log("normal search");
    var productsObs=this._httpService.fetchSearchedProducts(this.searchQuery)
    productsObs.subscribe(data=>{
      if(data['success'] == 1){
      console.log("Queried products: ", data)
      this.products = data['products'];
      if(this.products.length == 0){
        this.num_results = 0;
        this.show_noProducts = true;
      }else{
        this.num_results = this.products.length;
        this.show_noProducts = false;
        this.show_normalProducts = true;
      }
      //console.log(this.products);
      this.search_logic();
      }else{
        this.num_results = 0;
        this.show_noProducts = true;
      }
    })
  }

  fetchCategorySearchedProducts(category){
      console.log("In the fetchCategorySearchedProducts method!!");
      console.log("category: ", category);

      var productsObs=this._httpService.fetchCategorySearchedProducts(this.searchQuery, category)
      productsObs.subscribe(data=>{
        console.log("Queried products: ", data)
        if(data['success'] == 1){
          this.products = data['products'];
          if(this.products.length == 0){
            this.num_results = 0;
            this.show_noProducts = true;
          }else{
            this.num_results = this.products.length;
            this.show_noProducts = false;
            this.show_normalProducts = true;
          }
          this.search_logic();
        }else{
          this.num_results = 0;
          this.show_noProducts = true;
        }
      })

  }

  private search_logic (){
    console.log("starting search");
    //first thing is to call the getAllProducts service
    //then sort all of the products based on their rating
    //the product array of objects needs to add the price, product image, product name, and rating,productid.
    //decide how many products go on each page?
    //use products array
    console.log(this.products);
    this.page_results = this.num_results / 12;
    this.page_results = Math.trunc(this.page_results);
    if(this.page_results == 0){
      this.page_results = 1;
    }

  }

  getSearchedProduct(){
    return this.searchQuery;
  }




  searchFilter(){
   console.log("five star filter",this.five_star_filter);
   console.log("high low star filter",this.high_low_star_filter);
   console.log("low high star filter",this.low_high_star_filter);
   console.log("popular filter",this.popular_filter);
   console.log("high-low filter",this.high_low_filter);
   console.log("low-high filter",this.low_high_filter);

    if(this.products.length > 1){
      //high to low search filter
      if(this.high_low_filter){ 
        this.products.sort((n1,n2)=> n2['price'] - n1['price']);
      }
      //low to high search filter
      if(this.low_high_filter){
        this.products.sort((n1,n2)=> n1['price'] - n2['price']);
      }
      //popular high to low filter
      if(this.popular_filter ){
        this.products.sort((n1,n2)=> n2['num_sold'] - n1['num_sold']);
      }
      //five star filter
      if(this.five_star_filter){
       /* this.show_normalProducts = false;
        this.products.forEach(element => {
          if(element['rating'] == 5){
            this.fiveStarProducts.add(element);
          }
        });
        if(this.fiveStarProducts.length == 0){
          this.show_noProducts = true;
        }else{
          this.show_fiveStarProducts = true;
        }*/
      }else if(this.five_star_filter == false){
        this.show_normalProducts = true;
        this.show_fiveStarProducts = false;
      }
      //high low star filter
      if(this.high_low_star_filter){
        //this.products.sort((n1,n2)=> n2['rating'] - n1['rating']);
      }
      //low high star filter
      if(this.low_high_star_filter){
        //this.products.sort((n1,n2)=> n1['rating'] - n2['rating']);
      }
    }
  }

  
 

  
}
