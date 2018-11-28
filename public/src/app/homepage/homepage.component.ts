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
  featuredProductPromo:any;
  showBB:boolean;
  showSB:boolean;
  showFP:boolean;
  constructor(private _httpService:HttpService) {
    this.bigBannerPromo = [];
    this.smallBannerPromo = [];
    this.featuredProductPromo = [];
    this.showBB = false;
    this.showSB = false;
    this.showFP = false;
   }

  ngOnInit() {
    // this.fetchFeatured()
    this.fetchFeaturedBB();
  }
  fetchFeatured(){
    var featuredObs=this._httpService.fetchFeatured()
    featuredObs.subscribe(data=>{
        if (data['success'] == 1){
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
            this.featuredProductPromo = data['featuredProducts'];
            console.log(this.featuredProductPromo);
            this.showFP = true;
          }else if(data['featuredProducts'].length == 0){
            this.showFP = false;
          }

        }else{
          this.showBB = false;
          this.showFP = false;
          this.showSB = false;
        }
    }) 
  }
  fetchFeaturedBB(){
    console.log("Calling fetchFeaturedBB function")
    var featuredObs=this._httpService.fetchFeaturedBB();
    featuredObs.subscribe(data=>{
      console.log("Response:", data)
      if(data['success']==1){
        this.bigBannerPromo=data['products']
        this.showBB=true;
      }
      else{
        this.showBB=false;
      }
    })
  }

}
