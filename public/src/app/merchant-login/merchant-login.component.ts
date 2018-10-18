import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-merchant-login',
  templateUrl: './merchant-login.component.html',
  styleUrls: ['./merchant-login.component.css']
})
export class MerchantLoginComponent implements OnInit {

  license:string;
  password:string;

  showErr_license:boolean;
  showErr_password:boolean:
  showErr_showErr:boolean;

  constructor(private _router: Router,  private _httpService:HttpService) {
    this.license = "";
    this.password = "";

    this.showErr_license = false;
    this.showErr_showErr = false;
    this.showErr_password = false;
  }

  ngOnInit() {
  }


  loginButton(){
    if(this.license.length  < 1 || this.password.length < 1){
      this.showErr_showErr = true;
    }
    else{
      this.showErr_showErr = false;
      var err=this._httpService.loginMerchant(this.license, this.password);
      err.subscribe(data=>{
        console.log("response:", data)
        if(data['success']==-1){
          //Server error
          this.showErr_showErr = true;
          return;
        }
        else if(data['success']==0){
          //CLient error, check message, User probably exists with email
          this.showErr_showErr = true;
          return;
        }
        else{
          //success==1, registration successful
          // this.cookieService.set('loggedIn', "true")
          // this.cookieService.set('userID', data['userID'])
          // this.cookieService.set('first_name', data['first_name'])
      //    localStorage.setItem('loggedIn', "true")
      //    localStorage.setItem('userID', data['userID'])
    //      localStorage.setItem('firstName', data['first_name'])
    //      location.reload(true)
          this._router.navigate(['/merchant-portal']);
        }

      })
    }
  }

}
