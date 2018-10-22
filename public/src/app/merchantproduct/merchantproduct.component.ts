import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-merchantproduct',
  templateUrl: './merchantproduct.component.html',
  styleUrls: ['./merchantproduct.component.css']
})
export class MerchantProductComponent implements OnInit {
  // currProduct:any
  constructor(private _httpService: HttpService, private _router:Router) {

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
