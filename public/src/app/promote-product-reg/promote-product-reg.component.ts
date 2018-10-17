import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-promote-product-reg',
  templateUrl: './promote-product-reg.component.html',
  styleUrls: ['./promote-product-reg.component.css']
})
export class PromoteProductRegComponent implements OnInit {

  showPromotionType:boolean;
  showPromotionDuration:boolean;
  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService) {
    this.showPromotionType = false;
    this.showPromotionDuration = false;
   }

  ngOnInit() {
  }

  promotiontypeClicked(){
    this.showPromotionType=!this.showPromotionType;
  }

  promotiondurationClicked(){
    this.showPromotionDuration=!this.showPromotionDuration;
  }
}
