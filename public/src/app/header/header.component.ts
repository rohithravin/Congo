import { Component, OnInit, Input} from '@angular/core';
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
  @Input() first_name:string
  loggedIn:boolean
  userID:string
  showAccount:boolean
  categoriesTitle:string
  merchantLoggedIn:boolean
  // constructor(private cookieService: CookieService) {
  constructor(){
    this.showCategories=false;
    this.showAccount=false;
    this.searchQuery='';
    this.categoriesTitle = 'CATEGORIES'
    if(localStorage.getItem('loggedIn')===null){
      localStorage.setItem('loggedIn', 'false')
    }
    if(localStorage.getItem('loggedIn')==="true"){
      this.first_name=localStorage.getItem('firstName')
      this.loggedIn=true
      this.userID=localStorage.getItem('userID')
    }
    else{
      this.loggedIn=false
    }
    if(localStorage.getItem('merchantLoggedIn')==null || localStorage.getItem('merchantLoggedIn')=='false'){
      this.merchantLoggedIn=false
    }
    else{
      this.merchantLoggedIn=true
    }
   }

   changeCategory(item){
     this.showCategories=!this.showCategories;
     this.categoriesTitle = item;
     localStorage.setItem('category', 'item')

   }

  ngOnInit() {
    // this.first_name=localStorage.getItem('firstName')
    // if(this.cookieService.check('loggedIn') && this.cookieService.get('loggedIn')=='true'){
    //   this.first_name=this.cookieService.get('first_name')
    // }
  }
  categoriesClicked(){
    this.showCategories=!this.showCategories;
  }
  accountClicked(){
    this.showAccount=!this.showAccount;
  }
  logout(){
    localStorage.clear()
    this.first_name=''
    this.loggedIn=false;
    this.userID='-1'
  }

}
