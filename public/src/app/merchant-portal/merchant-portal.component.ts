import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-portal',
  templateUrl: './merchant-portal.component.html',
  styleUrls: ['./merchant-portal.component.css']
})
export class MerchantPortalComponent implements OnInit {

  constructor(private _router:Router) {

   }

  ngOnInit() {
    if(localStorage.getItem('merchantLoggedIn')==null || localStorage.getItem('merchantLoggedIn')=='false'){
      this._router.navigate(['']);
    }
    else if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['']);
    }
  }

}
