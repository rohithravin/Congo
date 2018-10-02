import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'; 



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  productName:string;

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



  constructor(private _Activatedroute: ActivatedRoute,
    private _router:Router ) { 
    this.productName = ''
  }

  ngOnInit() {
     this.productName = this._Activatedroute.snapshot.params['productid']
    console.log(this.productName);
    this.search_logic()
  }

  private search_logic (){
    console.log("starting search");
    //first thing is to call the getAllProducts service
    //then sort all of the products based on their rating 
    //the product array of objects needs to add the price, product image, product name, and rating.
    //decide how many products go on each page?
  }

  getSearchedProduct(){
    return this.productName;
  }

  setFiveStarFilter(){
    
  }
}


