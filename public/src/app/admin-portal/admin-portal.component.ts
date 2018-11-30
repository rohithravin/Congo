import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit() {
    if(localStorage.getItem('loggedIn')==null || localStorage.getItem('loggedIn')=='false'){
      return this._router.navigate([''])
    }
    if(localStorage.getItem('adminLoggedIn')==null || localStorage.getItem('adminLoggedIn')=='false'){
      return this._router.navigate([''])
    }
  }

}
