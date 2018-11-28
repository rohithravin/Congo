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
  recomTagList:any;
  recomCatList:any;
  pulledProducts:any;

  constructor(private _httpService:HttpService) {
    this.bigBannerPromo = [];
    this.smallBannerPromo = [];
    this.featuredProductPromo = [];
    this.showBB = false;
    this.showSB = false;
    this.showFP = false;
    this.recomTagList = [];
    this.recomCatList= [];
    this.pulledProducts= [];
   }

  ngOnInit() {
    // this.fetchFeatured()
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

  // recommendedProducts(){
  //       pulledProducts[products];//server call(getViewingHistory)
  //       var i = 0; //iterate through products
  //       var j = 0; //iterate through tags
  //       while(i <=pulledProducts.length){
  //            //hashing tags
  //            while( pulledProducts[i[j]] ){
  //                  let j = recommendedHash(pulledProducts[i[j]]);
  //                  if(!this.recomTagList[j]){
  //                       this.recomTagList[j] = [];
  //                  }
  //                  this.recomTagList[j].push(1);
  //
  //            }
  //
  //
  //            i++;
  //      }
  // }

  recommendedHash(name){
        var hashed='';
        for(var i=1; i<name.length-1; i+=2){
            var numberOrLetter=Math.floor(Math.random()*3+1)
            if(numberOrLetter==3){
                var toAdd=Math.floor(Math.random()*9)
                toAdd+=78
                hashed+=String.fromCharCode(toAdd)
            }
            else{
                var currentChar=name[i].charCodeAt(0)
                var upperLower=Math.floor(Math.random()*2+1)
                currentChar=(((currentChar+22)*28-52)*3)%26
                if(upperLower==1){
                    currentChar+=65
                } 
                else if(upperLower==2){
                    currentChar+=97
                }
                hashed+=String.fromCharCode(currentChar)
            }
        }
  }
}
