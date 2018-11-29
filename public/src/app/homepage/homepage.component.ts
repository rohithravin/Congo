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
  finalProducts:any;
  finalCategory:any;
  finalTag:any;
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
    this.arrTagKey=[];
    this.arrCatKey=[];
    this.arrTagList=[];
    this.arrCatList=[];
    this.pulledProducts= [];
    this.finalProducts=[];
   }

  ngOnInit() {
    // this.fetchFeatured()
    // this.fetchFeaturedBB();
    // this.fetchFeaturedSB();
    // this.fetchFeaturedFP();
    // this.recommendedHash();

    this.fetchHistory();
  }

  fetchRecommendedProducts(category, tag){
        console.log("fetching recommended products...")

        var finalRec = this._httpService.fetchRecommendedProducts(category, tag);
        finalRec.subscribe(data=>{
             console.log("data: ", data);
             if(data['success'] == -1){
                   console.log("there was a server error!!");
             }else{
                   this.finalProducts = data['products'];
                   this.finalCategory = data['category'];
                   this.finalTag = data['tag'];

                   console.log("final products: ", this.finalProducts);
                   console.log("category: ", this.finalCategory);
                   console.log("tag: ", this.finalTag);
             }
        })
  }
  fetchHistory(){
        if(localStorage.getItem('userID')){
             console.log("inside recommended products")
             var histObs = this._httpService.fetchHistory(localStorage.getItem('userID'));
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

      console.log(this.arrTagList);
      console.log("numItems in arrTagList[]: ", this.arrTagList.length);
      //console.log(this.arrCatList);
      console.log("arrTagKey[]: ", this.arrTagKey);
      //console.log(this.arrTagKey);
      console.log(this.arrCatList);
      console.log("numItems in arrCatList[]: ", this.arrCatList.length);
      console.log("arrCatKey[]: ", this.arrCatKey);
      console.log("end of recommendedProducts!!");

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
      console.log("NEW TAG---------------------------")
      console.log(this.arrTagList);
      console.log("numItems in arrTagList[]: ", this.arrTagList.length);
      //console.log(this.arrCatList);
      console.log("arrTagKey[]: ", this.arrTagKey);


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

      console.log("NEW CATEGORIES--------------------")
      console.log(this.arrCatList);
      console.log("numItems in arrCatList[]: ", this.arrCatList.length);
      console.log("arrCatKey[]: ", this.arrCatKey);

      //server call for pulling products

      console.log(this.arrCatKey[0]);
      console.log(this.arrTagKey[0]);
      this.fetchRecommendedProducts(this.arrCatKey[0], this.arrTagKey[0]);


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
