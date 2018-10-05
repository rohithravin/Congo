import { Component, OnInit } from '@angular/core';
import {HttpService} from './http.service'
// import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'public';
  // constructor(private _httpService: HttpService,  private cookieService: CookieService){
  constructor(private _httpService: HttpService){

  }
  ngOnInit(){
    // if(this.cookieService.check('loggedIn')==false){
    //   this.cookieService.set('loggedIn', 'false')
    // }
  }
}
