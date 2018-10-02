import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searched_product:string
  constructor(public router: Router) { 

    this.searched_product='';
  }

  ngOnInit() {
    
  }


 
}

