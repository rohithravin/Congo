import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService }  from '../http.service';

@Component({
  selector: 'app-user-reg',
  templateUrl: './user-reg.component.html',
  styleUrls: ['./user-reg.component.css']
})
export class UserRegComponent implements OnInit {

  first_name:string;
  last_name:string;
  email:string;
  password:string;
  password_validated:string;
  phone_num:string;
  showErr:boolean;
  errMessage:string;

  constructor(private _router: Router,  private _httpService:HttpService) {
    this.first_name = "";
    this.last_name = "";
    this.email = "";
    this.password = "";
    this.password_validated = "";
    this.phone_num = "";
    this.showErr = false;
    this.errMessage = "";

  }

  ngOnInit() {

  }

  submitButton(){
    if(this.first_name == "" || this.last_name == "" || this.email == "" || this.password == "" || this.password_validated == "" || this.phone_num == ""){
        this.errMessage ="Please fill out all fields.";
        this.showErr = true;
        return;
    }
    if(this.first_name.match(/^[A-Za-z]+$/) == null || this.first_name.length < 2 ){
      this.errMessage ="Please correct first name.";
      this.showErr = true;
      return;
    }
    if(this.last_name.match(/^[A-Za-z]+$/) == null || this.last_name.length < 2){
      this.errMessage ="Please correct last name.";
      this.showErr = true;
      return;
    }
    if(this.email.match(/^\S+@\S+/) == null){
      this.errMessage ="Please correct email.";
      this.showErr = true;
      return;
    }
    if(this.phone_num.length != 10  || '0123456789'.indexOf(this.phone_num) !== -1){
      this.errMessage ="Please correct phone number";
      this.showErr = true;
      return;
    }
    if(this.password.length < 8){
      this.errMessage ="Please correct password.";
      this.showErr = true;
      return;
    }
    if(this.password != this.password_validated){
      this.errMessage ="Please correct confirm password.";
      this.showErr = true;
      return;
    }
    if(!this.showErr){
      var err=this._httpService.createNewUser(this.first_name, this.last_name, this.email,this.phone_num ,this.password)
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
          this.errMessage ="User already exists";
          this.showErr = true;
          return;
        }
        else{
          //success==1, registration successful
          this._router.navigate(['/user-login']);
        }

      })

    }
  }
}
