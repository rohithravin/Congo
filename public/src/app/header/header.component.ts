import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showCategories:boolean
  constructor() {
    this.showCategories=false;
   }

  ngOnInit() {
  }
  categoriesClicked(){
    this.showCategories=!this.showCategories;
  }

}
