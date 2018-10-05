import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showCategories:boolean
  searchQuery:string
  constructor() {
    this.showCategories=false;
    this.searchQuery=''
   }

  ngOnInit() {
  }
  categoriesClicked(){
    this.showCategories=!this.showCategories;
  }

}
