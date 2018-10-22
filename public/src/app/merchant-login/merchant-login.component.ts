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
  errMessage:string;

  showErr_license:boolean;
  showErr_password:boolean;
  showErr_showErr:boolean;

  constructor(private _router: Router,  private _httpService:HttpService) {
    this.license = "";
    this.password = "";
    this.errMessage = "";

    this.showErr_license = false;
    this.showErr_showErr = false;
    this.showErr_password = false;
  }

  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')!=null && localStorage.getItem('merchantLoggedIn')=='true'){
      this._router.navigate(['/merchant-portal']);
    }
    if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['/merchant-portal']);
    }
  }


  loginButton(){
    if(this.license.length  < 1 || this.password.length < 8){
      this.errMessage = "Enter Correct Credentials."
      this.showErr_showErr = true;
    }
    else{
      this.showErr_showErr = false;
      var err=this._httpService.loginMerchant(this.license, this.password);
      err.subscribe(data=>{
        console.log("response:", data)
        if(data['success']==-1){
          //Server error
          this.errMessage = "Server Error. Try Again Later."
          this.showErr_showErr = true;
          return;
        }
        else if(data['success']==0){
          //CLient error, check message, User probably exists with email
          this.errMessage = "Invalid Credentials. Please Try Again."
          this.showErr_showErr = true;
          return;
        }
        else{
          localStorage.setItem('merchantLoggedIn', 'true')
          localStorage.setItem('licenseNo',this.license)
          this._router.navigate(['/merchant-portal']);
        }
      })
    }
  }

}
