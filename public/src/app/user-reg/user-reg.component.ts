import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

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

  constructor(private _router: Router) {
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
    if(this.first_name.match(/^[A-Za-z]+$/) == null){
      this.errMessage ="Please correct first name.";
      this.showErr = true;
      return;
    }
    if(this.last_name.match(/^[A-Za-z]+$/) == null){
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











  //  this._router.navigate(['/user-login']);
  }

}
