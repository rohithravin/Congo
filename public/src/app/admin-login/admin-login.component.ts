import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  email:string;
  password:string;
  pin:string;
  userId:string;
  errMessage:string;
  
  errEmail:boolean;
  errPassword:boolean;
  errPin:boolean;
  errShowErr:boolean;

  constructor(private _router:Router, private _httpService:HttpService) {
    this.email = '';
    this.password = '';
    this.pin = '';
    this.userId = '';
    this.errMessage = '';
    this.errEmail = false;
    this.errPassword = false;
    this.errPin = false;
    this.errShowErr = false;
  }

  ngOnInit() {
    if(localStorage.getItem(adminLoggedIn) == null || localStorage.getItem(adminLoggedIn) == false){
      this._router.navigate(['']);
    }
    if(localStorage.getItem(adminLoggedIn) != null && localStorage.getItem(adminLoggedIn) == true){
      this._router.navigate(['/admin-portal'])
    }
  }

  loginButton() {
      this.errShowErr = false;
      var admin = this._httpService.processAdminLogin(this.email, this.password, this.pin);
      admin.subscribe(data=>{
        if(data['success'] == -2){
          this.errMessage = "Invalid PIN";
          this.errShowErr = true;
        }
        else if(data['success'] == -1){
          this.errMessage = "Server error";
          this.errShowErr = true;
        }
        else if(data['success'] == 0){
          this.errMessage = "Invalid password or PIN. Please check these fields.";
          this.errShowErr = true;
        }
        else{
          localStorage.setItem('adminLoggedIn',true);
          this._router.navigate(['/admin-portal']);
        }
      })
    }
  }

  adminButton(){
    var admin = this._httpService.
    this.email = 'mitch@purdue.edu';
    this.password = 'hellothere';
    this.pin = '123';
    this.userId = '1234';
    
  }
}
