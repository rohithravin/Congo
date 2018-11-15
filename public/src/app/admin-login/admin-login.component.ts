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
    this.errMessage = 'Invalid Login';
    this.errEmail = false;
    this.errPassword = false;
    this.errPin = false;
    this.errShowErr = false;
  }

  ngOnInit() {
    // if(localStorage.getItem('adminLoggedIn') == null || localStorage.getItem('adminLoggedIn') == 'false'){
    //   this._router.navigate(['']);
    // }
    if(localStorage.getItem('adminLoggedIn') != null && localStorage.getItem('adminLoggedIn') == 'true'){
      this._router.navigate(['/admin-portal'])
    }
  }

  loginButton() {
    // this.userId = 'admin';
    // this.pin = '1234';
    // this.email = 'johndoe@gmail.com';
    // this.password = 'hellothere';
    console.log("in login");
    this.errShowErr = false;
    var admin = this._httpService.processAdminLogin(this.email, this.password, this.pin);
    admin.subscribe(data=>{
      console.log("Response: ", data)
      if(data['success'] == -2){
        //this.errMessage = "Invalid PIN";
        this.errPin = true;
        this.errShowErr = true;
        return;
      }
      else if(data['success'] == -1){
        //this.errMessage = "Server error";
        this.errShowErr = true;
        return;
      }
      else if(data['success'] == 0){
        //this.errMessage = "Invalid password or PIN. Please check these fields.";
        this.errPassword = true;
        this.errPin = true;
        this.errShowErr = true;
        return;
      }
      else if(data['success'] == 1){
        console.log("backend");
        localStorage.setItem('adminLoggedIn','true');
        this._router.navigate(['/admin-portal']);
        this.errShowErr = false;
      }
    })
  }

  adminButton(){
    console.log("UserID:", localStorage.getItem('userID'))
    var new_pin = '1234';
    //this.email = 'johndoe@gmail.com';
    //this.password = 'hellothere';
    //this.userId = localStorage.getItem('userID');
    // this.pin = localStorage.getItem('pin');
    var admin = this._httpService.makeAdmin(localStorage.getItem('userID'), new_pin);
    admin.subscribe(data=>{
      console.log("Response:",data);
      console.log("Finish");
      // if(data['success'] == -2){
      //   this.errMessage = "This user does not have a PIN or has no admin privileges.";
      //   this.errShowErr = true;
      // }
      // else if(data['success'] == -1){
      //   this.errMessage = "Server error";
      //   this.errShowErr = true;
      // }
      // else if(data['success'] == 0){
      //   this.errMessage = "Invalid PIN/Password";
      //   this.errShowErr = true;
      // }
      // else if(data['success'] == 1){
      //   if(this.errEmail == false && this.errPassword == false && this.errPin == false && this.errShowErr == false){
      //     localStorage.setItem('admin-email',this.email);
      //     localStorage.setItem('admin-password',this.password);
      //     localStorage.setItem('admin-pin', this.pin);
      //     localStorage.setItem('admin-userId', this.userId);
      //     localStorage.setItem('adminLoggedIn','true');
      //     this._router.navigate(['/admin-portal']);
      // }
      //}
    })
  }
  
}
