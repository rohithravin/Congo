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
  sb1Image:string
  sb2Image:string
  constructor(private _httpService:HttpService) {
    this.bigBannerPromo = [];
    this.smallBannerPromo = [];
    this.featuredProductPromo = [];
    this.showBB = false;
    this.showSB = false;
    this.showFP = false;
    this.sb1Image=''
    this.sb2Image=''
   }

  ngOnInit() {
    // this.fetchFeatured()
    // this.fetchFeaturedBB();
    // this.fetchFeaturedSB();
    // this.fetchFeaturedFP();
    this.fetchTest();
  }

  fetchTest(){
    var featureObs=this._httpService.fetchFeatured();
    featureObs.subscribe(data=>{
      console.log("featured ",data);
      if(data['success']==1){
        //succ
        var allFeatured = data['products'];
        allFeatured.forEach(element => {
          console.log("el ",element);
          var randIndex = Math.floor(Math.random() * 10);
          randIndex = randIndex%2;
          if(element['promotionType'] == 'FP'){
            if(this.featuredProductPromo.length != 6){
              if(randIndex){
                this.featuredProductPromo.push(element);
              }
            }
          }else if(element['promotionType'] == 'SB'){
            if(this.smallBannerPromo.length != 2){
                if(randIndex){
                  this.smallBannerPromo.push(element);
                }
            }
          }else if(element['promotionType'] == 'BB'){
            if(this.bigBannerPromo.length != 5){
              if(randIndex){
                this.bigBannerPromo.push(element);
              }
            }
          }
        });
        //since its a 50/50 chance we need to be certain there is enough in each one statistically this should work enough
        allFeatured.forEach(element => {
          console.log("el ",element);
          var randIndex = Math.floor(Math.random() * 10);
          randIndex = randIndex%2;
          if(element['promotionType'] == 'FP'){
            if(this.featuredProductPromo.length != 6){
              if(randIndex){
                this.featuredProductPromo.push(element);
              }
            }
          }else if(element['promotionType'] == 'SB'){
            if(this.smallBannerPromo.length != 2){
                if(randIndex){
                  this.smallBannerPromo.push(element);
                }
            }
          }else if(element['promotionType'] == 'BB'){
            if(this.bigBannerPromo.length != 5){
              if(randIndex){
                this.bigBannerPromo.push(element);
              }
            }
          }
        });
        if(this.bigBannerPromo.length > 0){
          this.showBB = true;
        }else if(this.bigBannerPromo.length == 0){
          this.showBB = false;
        }
        if(this.smallBannerPromo.length > 0){
          this.showSB = true;
        }else if(this.smallBannerPromo.length == 0){
          this.showSB = false;
        }
        if(this.featuredProductPromo.length > 0){
          console.log(this.featuredProductPromo);
          this.showFP = true;
        }else if(this.featuredProductPromo.length == 0){
          this.showFP = false;
        }
        console.log("FP ",this.featuredProductPromo);
        console.log("SB ",this.smallBannerPromo);
        console.log("promotionImage for SB0:",this.smallBannerPromo[0]['promotionImage'])
        this.sb1Image=this.smallBannerPromo[0]['promotionImage'];
        this.sb2Image=this.smallBannerPromo[1]['promotionImage'];
        console.log("BB ",this.bigBannerPromo);
      }else{
        //fail
      }
    })
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

          if(this.featuredProductPromo.length > 0){
            console.log(this.featuredProductPromo);
            this.showFP = true;
          }else if(this.featuredProductPromo.length == 0){
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

  fetchFeaturedSB(){
    var sbObs = this._httpService.fetchFeaturedSB();
    sbObs.subscribe(data=>{
      console.log(data);
      if(data['success'] == 1){
        this.smallBannerPromo = data['products'];
            this.showSB = true;
      }else{
        this.showSB = false;
      }
    })
  }

  fetchFeaturedFP(){
    var fpObs = this._httpService.fetchFeaturedFP();
    fpObs.subscribe(data=>{
      console.log("FP: ",data);
      if(data['success'] == 1){
        this.featuredProductPromo = data['products'];
        console.log(this.featuredProductPromo);
        this.showFP = true;
      }else{
        this.showFP = false;
      }
    })
  }

}
