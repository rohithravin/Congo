import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';
import { HeaderComponent } from '../header/header.component';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  email:string;
  password:string;
  errMessage:string;
  showErr:boolean;

  // constructor(private _router: Router,  private _httpService:HttpService, private cookieService: CookieService) {
  constructor(private _router: Router,  private _httpService:HttpService) {
    this.email = "";
    this.password = "";
    this.showErr = false;
    this.errMessage = "";
   }

  ngOnInit() {
    // if(this.cookieService.get('loggedIn')=='true'){
    //   this._router.navigate([''])
    // }
  }

  loginButton(){
    if(this.email.match(/^\S+@\S+/) == null){
      this.errMessage ="Please correct email.";
      this.showErr = true;
      return;
    }
    if(this.password.length < 8){
      this.errMessage ="Please correct password.";
      this.showErr = true;
      return;
    }
    if(!this.showErr){
      var err=this._httpService.loginUser(this.email, this.password)
      err.subscribe(data=>{
        console.log("response:", data)
        if(data['success']==-1){
          //Server error
          this.errMessage ="Server crashed! Try again later!";
          this.showErr = true;
          return;
        }
        else if(data['success']==0){
          //CLient error, check message, User probably exists with email
          this.errMessage ="Invalid credentials.";
          this.showErr = true;
          return;
        }
        else{
          //success==1, registration successful
          // this.cookieService.set('loggedIn', "true")
          // this.cookieService.set('userID', data['userID'])
          // this.cookieService.set('first_name', data['first_name'])
          localStorage.setItem('loggedIn', "true")
          localStorage.setItem('userID', data['userID'])
          localStorage.setItem('firstName', data['first_name'])
          location.reload(true)
          this._router.navigate(['']);
        }
        
      })
  }
}
}
