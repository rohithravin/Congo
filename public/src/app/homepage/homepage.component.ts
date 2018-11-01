import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  bigBannerPromo:any;
  smallBannerPromo:any;
  featuredProductsPromo:any;
  constructor(private _httpService:HttpService) {
    this.bigBannerPromo = [];
    this.smallBannerPromo = [];
    this.featuredProductsPromo = [];
   }

  ngOnInit() {
    // this.fetchFeatured()
  }
  fetchFeatured(){
    console.log("Inside this function")
    var featuredObs=this._httpService.fetchFeatured()
    featuredObs.subscribe(data=>{
      console.log(data)
      this.bigBannerPromo = data['bigBanner'];
      this.smallBannerPromo = data['smallBanner'];
      this.featuredProductsPromo = data['featuredProducts'];
      console.log(this.smallBannerPromo);
      console.log(this.featuredProductsPromo);
    }) 
  }

}
