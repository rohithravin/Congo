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
  showErr_firstname:boolean;
  showErr_lastname:boolean;
  showErr_email:boolean;
  showErr_password:boolean;
  showErr_confirm:boolean;
  showErr_phoneNum:boolean;
  password_err:string;
  errMessage_email:string;
  errMessage:string;
  showErr:boolean


  constructor(private _router: Router,  private _httpService:HttpService) {
    if(localStorage.getItem('loggedIn')=='true'){
      this._router.navigate([''])
    }
    this.first_name = "";
    this.last_name = "";
    this.email = "";
    this.password = "";
    this.password_validated = "";
    this.phone_num = "";
    this.showErr_firstname = false;
    this.showErr_lastname = false;
    this.showErr_email = false;
    this.showErr_password = false;
    this.showErr_confirm = false;
    this.password_err = "";
    this.errMessage_email = "";
    this.errMessage = "";
    this.showErr = false;

  }

  ngOnInit() {

  }

  submitButton(){
    console.log(this.phone_num);
    console.log(this.password);


    //clear everything first
    this.showErr_firstname = false;
    this.showErr_lastname = false;
    this.showErr_email = false;
    this.showErr_password = false;
    this.showErr_confirm = false;

    if(this.first_name.match(/^[A-Za-z]+$/) == null || this.first_name.length < 2 ){
      this.showErr_firstname = true;
    }else{
      this.showErr_firstname = false;
    }


    if(this.last_name.match(/^[A-Za-z]+$/) == null || this.last_name.length < 2){
      this.showErr_lastname = true;
    }else{
      this.showErr_firstname = false;
    }

    if(this.email.match(/^\S+@\S+\.\S/) == null){
      // if(this.email.match())
      this.errMessage_email = "Enter valid email.";
      this.showErr_email = true;
    }else{
      this.showErr_email = false;
    }

    if(this.phone_num.length != 10  || '0123456789'.indexOf(this.phone_num) !== -1){
      console.log(this.phone_num.length);
      console.log('0123456789'.indexOf(this.phone_num));
      this.showErr_phoneNum = true;
    }else{
      this.showErr_phoneNum = false;
    }

    if(this.password.length < 8){
      this.password_err ="Password needs atleast 8 characters.";
      this.showErr_password = true;
    }else{
      this.showErr_password = false;
    }


    if(this.password != this.password_validated){
      this.showErr_confirm = true;
    }else{
      this.showErr_confirm = false;
    }


    if(!this.showErr_confirm && !this.showErr_email && !this.showErr_firstname && !this.showErr_lastname && !this.showErr_password && !this.showErr_phoneNum){
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
          this.errMessage_email ="Email is already used.";
          this.showErr_email = true;
          return;
        }
        else{
          //success==1, registration successful
          localStorage.setItem("registered","True");
          console.log("Local storage in reg:", localStorage.getItem("registered"))
          this._router.navigate(['/login']);
        }

      })

    }
  }
}
