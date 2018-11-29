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
  recomTagDict:any;
  recomCatDict:any;
  pulledProducts:any;
  fetchedHistory:any;
  hashed:any;
  constructor(private _httpService:HttpService) {
    this.fetchedHistory = [];
    this.bigBannerPromo = [];
    this.smallBannerPromo = [];
    this.featuredProductPromo = [];
    this.showBB = false;
    this.showSB = false;
    this.showFP = false;
    this.recomTagDict = {};
    this.recomCatDict= {};
    this.pulledProducts= [];
   }

  ngOnInit() {
    // this.fetchFeatured()
    // this.fetchFeaturedBB();
    // this.fetchFeaturedSB();
    // this.fetchFeaturedFP();
    // this.recommendedHash();

    this.fetchHistory();
  }

  fetchHistory(){
        if(localStorage.get(userID)){
             console.log("inside recommended products")
             var histObs = this._httpService.fetchHistory(localStorage.get(userID));
             histObs.subscribe(data=>{
                   console.log("data: ", data);
                   if(data['success'] == -1){
                        console.log("there was a server error!");
                   }else if(data['success'] == 0){
                        console.log("No user exists!!");
                  }else{
                        console.log("got info!!");
                        this.fetchedHistory = data['history'];
                        this.recommendedProducts();
                  }
             })

        }else{
             //not logged in
        }
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


  recommendedProducts(){
      console.log("inside recommendedProducts!!");
      this.pulledProducts = this.fetchedHistory;
      int i = 0; //iterates through products
      int j = 0; //iterates through tags

      while(i < this.pulledProducts.length){

            //get tags
            while(this.pulledProducts[i]['tags'][j]){
                  var tagName = this.pulledProducts[i]['tags'][j];
                  hashed = this.recommendedHash(tagName);
                  if(!(hashed in recomTagDict)){
                        recomTagDict[tagName] = 0;
                  }
                  recomTagDict[tagName]++;
                  j++;
            }

            //get categories
            var catName = this.pulledProducts[i]['category'];
            hashed = this.recomCatDict[catName] = 0;
            if(!(hashed in recomCatDict)){
                  recomCatDict[catName] = 0;
            }
            recomCatDict[catName]++;

            i++;
      }

  }

  recommendedHash(name){
       // console.log()

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
