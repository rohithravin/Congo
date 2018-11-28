import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-gift-card-confirmation',
  templateUrl: './gift-card-confirmation.component.html',
  styleUrls: ['./gift-card-confirmation.component.css']
})
export class GiftCardConfirmationComponent implements OnInit {
      giftCardValue:any;
      giftCardNumber:any;

  constructor(private _httpService: HttpService,private _router:Router) {
        this.giftCardValue = localStorage.getItem('giftCard');
        this.giftCardNumber = localStorage.getItem('giftCardNumber');
  }

  ngOnInit() {
//        console.log("giftcard value: test1 ");
//        console.log(this.giftCardValue);

  }

}
