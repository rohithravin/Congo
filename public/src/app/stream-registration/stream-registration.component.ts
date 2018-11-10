import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-stream-registration',
  templateUrl: './stream-registration.component.html',
  styleUrls: ['./stream-registration.component.css']
})
export class StreamRegistrationComponent implements OnInit {

  constructor(private _router:Router, private _httpService:HttpService) {

   }

  ngOnInit() {
    if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      return this._router.navigate([''])
    }
    else if(localStorage.getItem('userID')==null){
      return this._router.navigate([''])
    }
  }

}
