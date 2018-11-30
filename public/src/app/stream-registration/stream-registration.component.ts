import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-stream-registration',
  templateUrl: './stream-registration.component.html',
  styleUrls: ['./stream-registration.component.css']
})
export class StreamRegistrationComponent implements OnInit {
  cc_number:number;
  cc_string:string;
  showErr_cc:boolean;
  cvv_number:number;
  cvv_string:string;
  showErr_cvv:boolean;
  selectedCCDate:number;
  showErr_date:boolean;
  selectedCCYear:number;
  showErr_year:boolean;
  userID:string;
  show_succ:boolean;
  show_fail:boolean;
  stripeResp:string;

  constructor(private _router:Router, private _httpService:HttpService) {
    this.show_succ = false;
    this.show_fail = false;
    this.stripeResp = "";
    this.cc_number;
    this.cc_string = "";
    this.showErr_cc = false;
    this.cvv_number;
    this.cvv_string = "";
    this.showErr_cvv = false;
    this.selectedCCDate;
    this.selectedCCYear;
    this.showErr_date = false;
    this.showErr_year = false;
    this.userID = localStorage.getItem('userID');
   }

  ngOnInit() {
    if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      return this._router.navigate([''])
    }
    else if(localStorage.getItem('userID')==null){
      return this._router.navigate([''])
    }
    //check if they are already a stream member 
    if(localStorage.getItem('stream')=='true'){
      return this._router.navigate(['']);
    }
  }

  submitStream(){
    if(this.cc_number == null) {
      this.showErr_cc = true;
    }else{
     
      this.cc_string = this.cc_number.toString();
      if(this.cc_string.length < 16){
        this.showErr_cc = true;
      }else{
      this.showErr_cc = false;
      }
    }

    if(this.cvv_number == null){
      this.showErr_cvv = true;
    }else {
      
      this.cvv_string = this.cvv_number.toString();
      if(this.cvv_string.length < 3 || this.cvv_string.length > 4){
        this.showErr_cvv = true;
      }else{
        this.showErr_cvv = false;
      }
    }

    if (this.selectedCCDate == null){
      this.showErr_date = true;
    }else{
      this.showErr_date = false;
    }
  
    if(this.selectedCCYear == null){
      this.showErr_year = true;
    }else{
      var year = this.selectedCCYear.toString();
      if (year.length != 2){
        this.showErr_year = true;
       }else{
         this.showErr_year = false;
       }
    }

    if(localStorage.getItem('stream')=='true'){
      return this._router.navigate(['']);
    }else{

    if(!this.showErr_cc && !this.showErr_cvv && !this.showErr_date && !this.showErr_year){
      console.log("success");
      //once the stripe api has taken the users money
      var stripeObs = this._httpService.stripePurchase(this.cc_number,this.selectedCCDate,this.selectedCCYear,this.cvv_string,9900);
      stripeObs.subscribe(data=>{
        console.log("stripe ",data);
        if(data['success'] == 1){
              var streamObs = this._httpService.createStreamUser(this.userID);
          streamObs.subscribe(data=>{
            console.log(data);
            if(data['success'] == 1){
              console.log("succ made them a stream user");
              localStorage.setItem('stream','true');
              this.show_succ = true;
            }else{
              console.log("error!!");
            }
          });

        }else{
          console.log("error");
          this.show_fail = true;
          this.stripeResp = data['display_message'];
        }


      })

      
    }else{
      console.log("error");
      this.show_fail = true;
      this.stripeResp = "Card Information needs fixing!";
    }
  }
  }
}
