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
  showBB:boolean;
  showSB:boolean;
  showFP:boolean;
  constructor(private _httpService:HttpService) {
    this.bigBannerPromo = [];
    this.smallBannerPromo = [];
    this.featuredProductsPromo = [];
    this.showBB = false;
    this.showSB = false;
    this.showFP = false;
   }

  ngOnInit() {
     this.fetchFeatured()
  }
  fetchFeatured(){
    console.log("Inside this function")
    var featuredObs=this._httpService.fetchFeatured()
    featuredObs.subscribe(data=>{
      console.log(data)
      
      if(data['success'] == 1){
        if(data['bigBanner'].length > 0){
          this.bigBannerPromo = data['bigBanner'];
          this.showBB = true;
        }else if(data['bigBanner'].length == 0){
          this.showBB = false;
        }

        if(data['smallBanner'].length > 0){
          this.smallBannerPromo = data['smallBanner'];
          this.showSB = true;
        }else if(data['smallBanner'].length == 0){
          this.showSB = false;
        }
        if(data['featuredProducts'].length > 0){
          this.featuredProductsPromo = data['featuredProducts'];
          this.showFP = true;
        }else if(data['featuredProducts'].length == 0){
          this.showFP = false;
        }
      }
      console.log(this.smallBannerPromo);
      console.log(this.featuredProductsPromo);
    }) 
  }

}
