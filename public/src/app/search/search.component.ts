import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'; 
import { throwError } from 'rxjs';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {
  
 

 products: Array<any> = [];
  
  productName:string;
  filterSize;
star:string;
/* these are the boolean filters */
five_star_filter:boolean;
three_four_star_filter:boolean;
one_two_star_filter:boolean;
popular_filter:boolean;
low_high_filter:boolean;
high_low_filter:boolean;
/* these are the boolean filters */

//string to hold the categories shown
categories:string;


  constructor(private _Activatedroute: ActivatedRoute,
    private _router:Router ) { 
    
     
      
      
    this.productName = ''
    this.filterSize = 6;
    this.star = "checked";
    this.five_star_filter = false;
    this.three_four_star_filter= false;
    this.one_two_star_filter = false;
    this.popular_filter = false;
    this.low_high_filter = false;
    this.high_low_filter = false;

    this.categories = '';

  }

  ngOnInit() {

     this._Activatedroute.params.subscribe(
      params => {
        this.productName =  params['productid']
        console.log(this.productName);
        this.search_logic()
        this.clearFilter();
      }
     );
   
    
  }

  clearFilter(){
    this.five_star_filter = false;
    this.three_four_star_filter= false;
    this.one_two_star_filter = false;
    this.popular_filter = false;
    this.low_high_filter = false;
    this.high_low_filter = false;
    this.categories = '';
  }

  private search_logic (){
    console.log("starting search");
    //first thing is to call the getAllProducts service
    //then sort all of the products based on their rating 
    //the product array of objects needs to add the price, product image, product name, and rating,productid.
    //decide how many products go on each page?
    //use products array
  }

  getSearchedProduct(){
    return this.productName;
  }

  setFiveStarFilter(){
    this.five_star_filter = !this.five_star_filter;
  }
    

  searchFilter(){
    let filters: Array<boolean> = [];
    filters = this.getAllSearchFilters();
    console.log(filters);
    console.log("test");
    
    
  }

  setThreeFourStarFilter(){
    if (!this.three_four_star_filter){
      this.three_four_star_filter = true;
    }else {
      this.three_four_star_filter = false;
    }
  }

  setOneTwoStarFilter(){
    if (!this.one_two_star_filter){
      this.one_two_star_filter = true;
    }else {
      this.one_two_star_filter = false;
    }
  }

  
  setPopularFilter() {
    if (!this.popular_filter){
      this.popular_filter = true;
    }else {
      this.popular_filter = false;
    }
  }

  setLowHighFilter() {
    if (!this.low_high_filter){
      this.low_high_filter = true;
    }else {
      this.low_high_filter= false;
    }
  }

  setHighLowFilter() {
    if (!this.high_low_filter){
      this.high_low_filter = true;
    }else {
      this.high_low_filter = false;
    }
  }

  public getAllSearchFilters () {
    let filters: Array<boolean> = [];

    //if more filters are added then filter size must be changed
    filters.push(this.five_star_filter);
    filters.push(this.three_four_star_filter);
    filters.push(this.one_two_star_filter);
    filters.push(this.popular_filter);
    filters.push(this.low_high_filter);
    filters.push(this.high_low_filter);

    if (filters.length != this.filterSize ){
      //error
    }

    return filters;
  }

}


