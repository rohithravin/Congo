import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private _httpService:HttpService) { }

  ngOnInit() {
     this.fetchFeatured()
  }
  fetchFeatured(){
    console.log("Inside this function")
    var featuredObs=this._httpService.fetchFeatured()
    featuredObs.subscribe(data=>{
      console.log(data)
    }) 
  }

}
