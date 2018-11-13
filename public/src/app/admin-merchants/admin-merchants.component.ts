import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-merchants',
  templateUrl: './admin-merchants.component.html',
  styleUrls: ['./admin-merchants.component.css']
})
export class AdminMerchantsComponent implements OnInit {

  constructor(private _httpService:HttpService, private _router:Router) {

  }

  ngOnInit() {
    
  }

}
