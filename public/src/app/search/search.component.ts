import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  products: any;
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
  show_noProducts:boolean;
  num_results:number;

  constructor(private _Activatedroute: ActivatedRoute, private _router:Router, private _httpService:HttpService ) {
    this.products = {};
    this.searchQuery = '';
    this.filterSize = 6;
    this.star = "checked";
    this.five_star_filter = false;
    this.three_four_star_filter= false;
    this.one_two_star_filter = false;
    this.popular_filter = false;
    this.low_high_filter = false;
    this.high_low_filter = false;
    this.show_noProducts = false;
    this.num_results = 0;
  }

  ngOnInit() {
    this._Activatedroute.params.subscribe(
    params => {
      this.searchQuery =params['searchQuery']
      console.log(this.searchQuery);
      if(localStorage.getItem('categoryClicked') == 'true'){
            //console.log('in search: ',localStorage.getItem('category'));
            this.fetchCategorySearchedProducts(localStorage.getItem('category'));

      }else{
            this.fetchSearchedProducts();
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
        this.show_noProducts = true;
      }else{
        this.num_results = this.products.length;
        this.show_noProducts = false;
      }
      //console.log(this.products);
      this.search_logic();
      }else{
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
        this.products = data['products'];
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


  }

  getSearchedProduct(){
    return this.searchQuery;
  }




  searchFilter(){
   console.log("five star filter",this.five_star_filter);
   console.log("3-4 star filter",this.three_four_star_filter);
   console.log("1-2 star filter",this.one_two_star_filter);
   console.log("popular filter",this.popular_filter);
   console.log("high-low filter",this.high_low_filter);
   console.log("low-high filter",this.low_high_filter);
  }

 

  
}
