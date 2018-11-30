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
  arrTagList:any;
  arrTagKey:any;
  arrCatList:any;
  arrCatKey:any;
  finalProducts2:any
  finalProducts:any;
  finalCategory:any;
  finalTag:any;
  pulledProducts:any;
  hasRecomProds:boolean;
  hasRecomProds2:boolean;
  fetchedHistory:any;
  hashed:any;
  sb1Image:string
  sb2Image:string
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
    this.arrTagKey=[];
    this.arrCatKey=[];
    this.arrTagList=[];
    this.arrCatList=[];
    this.pulledProducts= [];
    this.finalProducts=[];
    this.finalProducts2=[];
   }

  ngOnInit() {
    this.fetchHistory();
    this.fetchTest();
  }

  fetchRecommendedProducts(category, tag){

        var finalRec = this._httpService.fetchRecommendedProducts(category, tag);
        finalRec.subscribe(data=>{
             if(data['success'] == -1){

             }else{
                   this.finalProducts = data['products'];
                   this.finalCategory = data['category'];
                   this.finalTag = data['tag'];
                   if(this.finalProducts.length > 0){
                        this.hasRecomProds = true;
                   }else{
                        this.hasRecomProds = false;
                   }

             }
        })


  }

  fetchRecommendedProducts2(category, tag){


        var finalRec = this._httpService.fetchRecommendedProducts(category, tag);
        finalRec.subscribe(data=>{
             if(data['success'] == -1){
             }else{
                   this.finalProducts2 = data['products'];
                   this.finalCategory = data['category'];
                   this.finalTag = data['tag'];

                   if(this.finalProducts2.length > 0){
                        this.hasRecomProds2 = true;
                   }else{
                        this.hasRecomProds2 = false;
                   }
             }
        })
  }
  fetchHistory(){
        if(localStorage.getItem('userID')){
             var histObs = this._httpService.fetchHistory(localStorage.getItem('userID'));
             histObs.subscribe(data=>{
                   if(data['success'] == -1){
                   }else if(data['success'] == 0){
                  }else{
                        this.fetchedHistory = data['history'];
                        this.recommendedProducts();
                  }
             })

        }else{
             //not logged in
        }
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
                this.featuredProductPromo.push(element);
            }
          }else if(element['promotionType'] == 'SB'){
            if(this.smallBannerPromo.length != 2){
                  this.smallBannerPromo.push(element);
            }
          }else if(element['promotionType'] == 'BB'){
            if(this.bigBannerPromo.length != 5){
                this.bigBannerPromo.push(element);
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

          if(data['featuredProducts'].length > 0){
            this.featuredProductPromo = data['featuredProducts'];
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
    var featuredObs=this._httpService.fetchFeaturedBB();
    featuredObs.subscribe(data=>{
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
      if(data['success'] == 1){
        this.featuredProductPromo = data['products'];
        this.showFP = true;
      }else{
        this.showFP = false;
      }
    })
  }


  recommendedProducts(){
      this.pulledProducts = this.fetchedHistory;
      var i = 0; //iterates through products
      //var j = 0; //iterates through tags

      while(i < this.pulledProducts.length){

            //get tags
            var tagsObs = this.pulledProducts[i]['tags'];
            var j = 0;
            while(tagsObs[j]){
                  //this.hashed = this.recommendedHash(tagsObs[j]);
                  if(!(tagsObs[j] in this.recomTagDict)){
                        this.recomTagDict[tagsObs[j]] = 0;
                  }
                  this.recomTagDict[tagsObs[j]]++;
                  j++;
            }
            // while(this.pulledProducts[i]['tags'][j]){
            //       var tagName = this.pulledProducts[i]['tags'][j];
            //       this.hashed = this.recommendedHash(tagName);
            //       if(!(this.hashed in this.recomTagDict)){
            //             this.recomTagDict[tagName] = 0;
            //       }
            //       this.recomTagDict[tagName]++;
            //       j++;
            // }

            //get categories
            var catName = this.pulledProducts[i]['category'];
            //this.hashed = this.recomCatDict[catName] = 0;
            if(!(catName in this.recomCatDict)){
                  this.recomCatDict[catName] = 0;
            }
            this.recomCatDict[catName]++;

            i++;
      }
      //storing tags into array
      //storing count of each tag into array
      var count = 0;
      for(var key in this.recomTagDict){
            this.arrTagList[count] = this.recomTagDict[key];
            this.arrTagKey[count]= key;
            count++;
      }
      //storing categories into array
      //storing count of each category into array
      count = 0;
      for(var key in this.recomCatDict){
            this.arrCatList[count] = this.recomCatDict[key];
            this.arrCatKey[count] = key;
            count++;
      }


      //sort tag list and arrTagKey
      var n = this.arrTagList.length;
      for(var i = 0; i < n; i++){
           for(var j = 1; j < n; j++){
                 if(this.arrTagList[j-1] < this.arrTagList[j]){
                      var temp = this.arrTagList[j-1];
                      this.arrTagList[j-1] = this.arrTagList[j];
                      this.arrTagList[j] = temp;

                      var tempKey = this.arrTagKey[j-1];
                      this.arrTagKey[j-1] = this.arrTagKey[j];
                      this.arrTagKey[j] = tempKey;
                 }
           }
      }


      //sort arrCatlist and arrCatKey
      n = this.arrCatList.length;
      for(i = 0; i < n; i++){
           for(j = 1; j < n; j++){
                 if(this.arrCatList[j-1] < this.arrCatList[j]){
                      var temp = this.arrCatList[j-1];
                      this.arrCatList[j-1] = this.arrCatList[j];
                      this.arrCatList[j] = temp;

                      var tempKey = this.arrCatKey[j-1];
                      this.arrCatKey[j-1] = this.arrCatKey[j];
                      this.arrCatKey[j] = tempKey;
                 }
           }
      }


      //server call for pulling products

      this.fetchRecommendedProducts(this.arrCatKey[0], this.arrTagKey[0]);

      this.fetchRecommendedProducts2(this.arrCatKey[1], this.arrTagKey[1]);

  }


  // bubbleSortArray(arr, key){
  //       var n = arr.length;
  //       for(var i in n){
  //            for(var j in n-1){
  //                  if(arr[j] > arr[j+1]){
  //                       var temp = arr[j];
  //                       arr[j] = arr[j+1];
  //                       arr[j+1] = temp;
  //
  //                       var tempKey = key[j];
  //                       key[j] = key[j+1];
  //                       key[j+1] = tempKey;
  //                  }
  //            }
  //       }
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
