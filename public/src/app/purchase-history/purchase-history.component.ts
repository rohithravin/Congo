import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {
  userID:any;
  orders:any;
  recentOrders:any;
  recentOrdersID:any;
  recentProductsPurchase:any;
  exists:Boolean;

  constructor(private _httpService:HttpService,private _router:Router) {
    this.userID = localStorage.getItem('userID');
    this.orders = [];
    this.recentOrders = [];
    this.recentOrdersID = [];
    this.recentProductsPurchase = [];
    this.exists = false;
  }

  ngOnInit() {
    this.getUserOrders();
    this.getRecentOrders();
  }


  getUserOrders(){
    if(localStorage.getItem('loggedIn') == 'false'){
      this._router.navigate(['login']);
    }
    var orderObs=this._httpService.getOrders(this.userID);
    orderObs.subscribe(data=>{
      if(data['success'] != 1){
        console.log("error");
      }else{
      this.orders = data['orders'];
      console.log(this.orders);
      }
    })
  }

  getRecentOrders(){
      this.getOrders();


  }

  getOrders(){
    var ordersObs=this._httpService.fetchRecentOrders(this.userID)
    ordersObs.subscribe(data=>{
      if(data['success']==1){
        this.recentOrders=data['orders']
        this.recentOrders.forEach(element => {
          this.recentOrdersID.push(element['_id'])
        });

        console.log('orderid')
        console.log(this.recentOrdersID)
        var temp_arry = []
        this.recentOrdersID.forEach(elementid => {

          console.log('check1')

          var orderObs=this._httpService.getOrder(this.userID, elementid);

          orderObs.subscribe(data2=>{

            if(data2['success'] != 1){
              console.log(data2['message']);
            }
            else{
              data2['items'].forEach(item => {
                temp_arry.push(item['product'])
              });

              temp_arry.forEach(element => {
                this.exists = false;
                if(this.recentProductsPurchase.length < 5){
                  if(this.recentProductsPurchase.length == 0){
                      this.recentProductsPurchase.push(element);

                  }
                  else{
                          for(var i = 0; i < this.recentProductsPurchase.length;i++){
                            if(this.recentProductsPurchase[i]['_id'] == element['_id']){
                              this.exists = true;
                            }
                            if(i == this.recentProductsPurchase.length-1){
                              if(this.exists == false){
                                this.recentProductsPurchase.push(element);
                              }
                            }
                          }
                        }
                    }
                  });
            }
          })
        });
        console.log("full ones")
        console.log(temp_arry)


        console.log("unqiue ones ")
        console.log(this.recentProductsPurchase)





      }
      else{
        console.log('Error')
      }
    })
  }
}
