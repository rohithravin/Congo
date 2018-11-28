import { Component, OnInit, Input} from '@angular/core';
import { Router,ActivatedRoute }  from '@angular/router';

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
  categories:any
  categoryClicked:boolean
  // constructor(private cookieService: CookieService) {
  constructor(private _router:Router){
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
    this.categories=['All Categories','Technology','Video Games','Clothing','Office','Food','Furniture','Hardware','Sports','Music','Outdoors','Laboratory','Other']
   }

   changeCategory(item){
       this.showCategories=!this.showCategories;
       this.categoriesTitle = item;
       //console.log('item: ',item);
       console.log(item)
       if(item != 'All Categories'){
       localStorage.setItem('categoryClicked','true');
       localStorage.setItem('category', item)
     }
      else{
        console.log('all categories clicked')
        localStorage.setItem('categoryClicked','false');
        localStorage.setItem('category', '')
      }
     //console.log("local storage category", localStorage.getItem('category'));
   }



  ngOnInit() {
    // this.first_name=localStorage.getItem('firstName')
    // if(this.cookieService.check('loggedIn') && this.cookieService.get('loggedIn')=='true'){
    //   this.first_name=this.cookieService.get('first_name')
    // }
  }
  categoriesClicked(){
    //console.log("in the categoriesClicked function!");
    //localStorage.setItem('categoryClicked','true');
    console.log(this.showCategories);
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

  search(){
    let element: HTMLElement = document.getElementById('sB') as HTMLElement;
    element.click();
  }
}
