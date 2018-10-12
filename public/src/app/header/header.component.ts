import { Component, OnInit } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showCategories:boolean
  showCategoriesAccount:boolean
  searchQuery:string
  first_name:string
  // constructor(private cookieService: CookieService) {
    constructor(){
    this.showCategories=false;
    this.showCategoriesAccount=false;
    this.searchQuery=''
    this.first_name=''
   }

  ngOnInit() {
    // if(this.cookieService.check('loggedIn') && this.cookieService.get('loggedIn')=='true'){
    //   this.first_name=this.cookieService.get('first_name')
    // }
  }
  categoriesClicked(){
    this.showCategories=!this.showCategories;
  }
  categoriesClickedAccount(){
    this.showCategoriesAccount=!this.showCategoriesAccount;
  }

}
