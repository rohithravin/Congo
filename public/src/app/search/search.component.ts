import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'; 
import { throwError } from 'rxjs';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

class product {
  price: number;
  name: string;
  rating: number;
  image: string;
}

export class SearchComponent implements OnInit {
  
  
  products: Array<product> = [];
  
  productName:string;
  filterSize;

/* these are the boolean filters */
five_star_filter:boolean;
three_four_star_filter:boolean;
one_two_star_filter:boolean;
book_filter:boolean;
furniture_filter:boolean;
electronic_filter:boolean;
four_price_filter:boolean;
three_price_filter:boolean;
one_price_filter:boolean;
relevance_filter:boolean;
popular_filter:boolean;
low_high_filter:boolean;
high_low_filter:boolean;
/* these are the boolean filters */

//string to hold the categories shown
categories:string;


  constructor(private _Activatedroute: ActivatedRoute,
    private _router:Router ) { 
    this.productName = ''
    this.filterSize = 13;

    this.five_star_filter = false;
    this.three_four_star_filter= false;
    this.one_two_star_filter = false;
    this.book_filter= false;
    this.furniture_filter = false;
    this.electronic_filter= false;
    this.four_price_filter = false;
    this.three_price_filter = false;
    this.one_price_filter = false;
    this.relevance_filter = false;
    this.popular_filter = false;
    this.low_high_filter = false;
    this.high_low_filter = false;

    this.categories = '';

  }

  ngOnInit() {
     this.productName = this._Activatedroute.snapshot.params['productid']
    console.log(this.productName);
    this.search_logic()
    this.clearFilter();
  }

  clearFilter(){
    this.five_star_filter = false;
    this.three_four_star_filter= false;
    this.one_two_star_filter = false;
    this.book_filter= false;
    this.furniture_filter = false;
    this.electronic_filter= false;
    this.four_price_filter = false;
    this.three_price_filter = false;
    this.one_price_filter = false;
    this.relevance_filter = false;
    this.popular_filter = false;
    this.low_high_filter = false;
    this.high_low_filter = false;
    this.categories = '';
  }

  private search_logic (){
    console.log("starting search");
    //first thing is to call the getAllProducts service
    //then sort all of the products based on their rating 
    //the product array of objects needs to add the price, product image, product name, and rating.
    //decide how many products go on each page?
    //use products array
  }

  getSearchedProduct(){
    return this.productName;
  }

  setFiveStarFilter(){
  if ( !this.five_star_filter){
    this.five_star_filter = true;
  }else{
    this.five_star_filter = false;
  }
    
  }

  searchFilter(){
    let filters: Array<boolean> = [];
    filters = this.getAllSearchFilters();
    console.log(filters);
    console.log("test");
    let filterFlag: Array<any> = [];
    let index = 0;
    this.categories = '';
    while(index < this.filterSize){
      if (filters[index]){
        filterFlag.push(1);
        switch(index){
          case(3):
          this.categories += " Books ";
          break;
          case(4):
          this.categories += " Furniture ";
          break;
          case(5):
          this.categories += " Electronics ";
          break;
          default:
          break;
        }
      }else{
        filterFlag.push(0);
      }

      index++;
    }
    console.log(filterFlag);
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

  setBookFilter() {
    if (!this.book_filter){
      this.book_filter = true;
    }else {
      this.book_filter= false;
    }
  }

  setFurnitureFilter () {
    if (!this.furniture_filter){
      this.furniture_filter = true;
    }else {
      this.furniture_filter= false;
    }
  }

  setElectronicFilter() {
    if (!this.electronic_filter){
      this.electronic_filter = true;
    }else {
      this.electronic_filter = false;
    }
  }

  setFourPriceFilter () {
    if (!this.four_price_filter){
      this.four_price_filter = true;
    }else {
      this.four_price_filter = false;
    }
  }

  setThreePriceFilter() {
    if (!this.three_price_filter){
      this.three_price_filter = true;
    }else {
      this.three_price_filter = false;
    }
  }

  setOnePriceFilter() {
    if (!this.one_price_filter){
      this.one_price_filter = true;
    }else {
      this.one_price_filter = false;
    }
  }

  setRelevanceFilter() {
    if (!this.relevance_filter){
      this.relevance_filter = true;
    }else {
      this.relevance_filter = false;
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
    filters.push(this.book_filter)
    filters.push(this.furniture_filter);
    filters.push(this.electronic_filter);
    filters.push(this.four_price_filter);
    filters.push(this.three_price_filter);
    filters.push(this.one_price_filter);
    filters.push(this.relevance_filter);
    filters.push(this.popular_filter);
    filters.push(this.low_high_filter);
    filters.push(this.high_low_filter);

    if (filters.length != this.filterSize ){
      //error
    }
    return filters;
  }

}


