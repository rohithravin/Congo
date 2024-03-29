import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpService }  from '../http.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  full_name:string;
  showErr_fullname:boolean;
  address_lineone:string;
  showErr_addr1:boolean;
  adress_linetwo:string;
  city:string;
  showErr_city:boolean;
  state:string;
  showErr_state:boolean;
  cc_number:number;
  showErr_ccNumber:boolean;
  cvv_code:number;
  showErr_cvvCode:boolean;
  phone_num:string;
  showErr_phoneNumber:boolean;
  email:string;
  showErr_email:boolean;
  str_cvv_code:string;
  str_cc_number:string;
  userID:string
  cart:any;
  shipping_date:any;
  tax:number;
  shipping:number;
  total:number;
  subtotal: number;
  showErr_year:boolean;
  showErr_date:boolean;
  selectedCCDate:string;
  selectedCCYear:string;
  CongoCredits:number;
  showErr_credits:boolean;
  show_fail:boolean;
  stripe_resp:string;
  show_stream:boolean;
  totalAfterCongoCredit:number;

  constructor(private _activaterouter:ActivatedRoute, private _httpService:HttpService, private _router: Router) {
    this.totalAfterCongoCredit = 0;
    this.show_stream = false;
    this.show_fail = false;
    this.stripe_resp = "";
    this.showErr_credits = false;
    this.CongoCredits = 0;
    this.selectedCCDate = "";
    this.selectedCCYear = "";
    this.showErr_year = false;
    this.showErr_date = false;
    this.str_cc_number = "";
    this.str_cvv_code = "";
    this.full_name = "";
    this.showErr_fullname = false;
    this.address_lineone= "";
    this.showErr_addr1 = false;
    this.adress_linetwo = "";
    this.city= "";
    this.showErr_city = false;
    this.state="";
    this.showErr_state = false;
    this.cc_number;
    this.showErr_ccNumber = false;
    this.cvv_code;
    this.showErr_cvvCode = false;
    this.phone_num = "";
    this.showErr_phoneNumber = false;
    this.email = "";
    this.showErr_email =false;
    this.cart={};
    this.subtotal = 0;
    this.tax = 0.0925;
    this.shipping = 5.99;
    this.total = 0;
    this.userID=localStorage.getItem('userID');
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    this.shipping_date = currentDate;
   }

  ngOnInit() {

    this.fetchCart();
    this.fetchUserCredits();
    this.checkStream();
  }

  checkStream(){
    if(localStorage.getItem('stream') == 'true'){
      var currentDate = new Date();
     currentDate.setDate(currentDate.getDate() + 2);
     this.shipping_date = currentDate;
      this.show_stream = true;
    }else{
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7);
      this.shipping_date = currentDate;
      this.show_stream = false;
    }
  }

  fetchUserCredits(){
    console.log("getting user credits");
    if(localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['/login'])
    }
      var creditObs = this._httpService.fetchUserCredits(this.userID);
      creditObs.subscribe(data=>{
        console.log(data);
        if(data['success'] == 1){
          this.CongoCredits = data['userCredits'];
        }else{
          this.CongoCredits = 0;
        }
        this.totalAfterCongoCredit = Math.floor((this.total - this.CongoCredits) * 100) / 100;
        if(this.totalAfterCongoCredit < 0){
          this.totalAfterCongoCredit = 0;
        }
      });
    
  }

  fetchCart(){
    if(localStorage.getItem('loggedIn')=='false'){
      this._router.navigate(['/login'])
    }
    console.log(this.userID)
    var cartObs=this._httpService.fetchCart(this.userID)
    cartObs.subscribe(data=>{
      console.log(data)
      // console.log(this.userID)
      if(data['success'] == 0 || data['success'] == -1){
        return this._router.navigate(['/'])
      }
      this.cart=data['cart']['items']
      console.log(this.cart)
      this.subtotal = this.getSubtotal();
      this.tax = this.getTax();
      this.shipping = this.getShipping();
      this.total = this.getTotal();
      if(this.cart.length==0){
        return this._router.navigate(['/cart']);
      }
    })

    //this.getSubtotal();
    //this.getTax();
    //this.getShipping();
    //this.getTotal();

  }


  getTotal(){
    this.total = this.subtotal + this.tax + this.shipping;
    if(localStorage.getItem('stream') == 'true'){
      this.total = this.total - (this.total * 0.1);
    }
    this.total = Math.floor(this.total * 100) / 100;
    return this.total;
    }
    getShipping(){
        this.shipping = 5.99;
        this.shipping =  Math.floor(this.shipping * 100) / 100;
        return this.shipping;
    }
    getTax(){
    this.tax = this.subtotal * 0.08;
    this.tax = Math.floor(this.tax * 100) / 100;
    return this.tax;
    }
    getSubtotal(){
      var i=0;
      while(i<this.cart.length){
        //console.log('in loop');
        this.subtotal+=parseFloat(this.cart[i]['product']['price']) * parseInt(this.cart[i]['quantity']);
        //console.log(this.subtotal);
        i++;
      }
      this.subtotal = Math.floor(this.subtotal * 100) / 100;
      return this.subtotal;
    }

  submitBilling(){

    if (this.full_name.length < 2){
      this.showErr_fullname = true;
    }else{
    this.showErr_fullname = false;
    }


   if (this.address_lineone.length < 5){
    this.showErr_addr1 = true;
   }else{
     this.showErr_addr1 = false;
   }


   

  if(this.selectedCCYear == null){
    this.showErr_year = true;
  }else{
    var year = this.selectedCCYear.toString();
    if (year.length != 2){
      this.showErr_year = true;
     }else{
       this.showErr_year = false;
     }
  }

   if (this.city.length < 4){
    this.showErr_city = true;
   }else{
     this.showErr_city = false;
   }


  if (this.state.length < 2){
    this.showErr_state = true;
  }else{
    this.showErr_state = false;
  }


    if(this.cc_number == null) {
      this.showErr_ccNumber = true;
    }else{

      this.str_cc_number = this.cc_number.toString();
      if(this.str_cc_number.length < 16){
        this.showErr_ccNumber = true;
      }else{
      this.showErr_ccNumber = false;
      }
    }

    if(this.cvv_code == null){
      this.showErr_cvvCode = true;
    }else {

      this.str_cvv_code = this.cvv_code.toString();
      if(this.str_cvv_code.length < 3 || this.str_cvv_code.length > 4){
        this.showErr_cvvCode = true;
      }else{
        this.showErr_cvvCode = false;
      }
    }



    if(this.phone_num.length != 10 ){
      //this.showErr_phoneNumber = true;
    }else{
      this.showErr_phoneNumber = false;
    }



    if(this.email.match(/^\S+@\S+\.\S/) == null){
      // if(this.email.match())

      this.showErr_email = true;
    }else{
      this.showErr_email = false;
    }

    if( !this.showErr_addr1 && !this.showErr_city  && !this.showErr_fullname && !this.showErr_state ){
        console.log("shipping info");
        var tempZip='47906';

        var stripeObs = this._httpService.stripePurchase(this.cc_number,this.selectedCCDate,this.selectedCCYear,this.str_cvv_code,this.total*100);
        stripeObs.subscribe(data=>{
          if(data['success'] == 1){
            var orderObs=this._httpService.createOrder(localStorage.getItem('userID'), this.address_lineone, this.city, this.state, tempZip, this.shipping, this.tax)
            
            orderObs.subscribe(orderdata=>{
              console.log("Response:", orderdata)

              if(orderdata['success']==1){
                localStorage.setItem('_COID',orderdata['order']['tempID']);
                var total = (orderdata['order']['total']).toString();
                localStorage.setItem('_t',total);
                var shipping = (orderdata['order']['shipping']).toString();
                localStorage.setItem('_s',shipping);
                var subt = (Math.floor((orderdata['order']['total'] - orderdata['order']['shipping']) * 100) / 100).toString();
                localStorage.setItem('_st',subt);
                //Update product view count now before routing
                
                localStorage.setItem('orderID',orderdata['order']['_id'])
                return this.updateSoldCount()
                
              }
              else{
                //issue with creating order, stay on page
                console.log("Error creating order")
              }
              
            })

          }
          else{
            //stripe error
            this.show_fail = true;
            this.stripe_resp = data['display_message'];
          }
        })
       
      }
  }
  updateSoldCount(){
    console.log("Calling updateSoldCount function")
    var orderID=localStorage.getItem('orderID')
    var updateObs=this._httpService.updateSoldCount(orderID)
      updateObs.subscribe(updateData=>{
        console.log("Update Data:", updateData)
        this._router.navigate(['checkout-conf']);
      })
  }

  submitCongoCredit(){
    if (this.full_name.length < 2){
      this.showErr_fullname = true;
    }else{
    this.showErr_fullname = false;
    }

   if (this.address_lineone.length < 5){
    this.showErr_addr1 = true;
   }else{
     this.showErr_addr1 = false;
   }

   if (this.city.length < 4){
    this.showErr_city = true;
   }else{
     this.showErr_city = false;
   }


  if (this.state.length < 2){
    this.showErr_state = true;
  }else{
    this.showErr_state = false;
  }

   

    if(!this.showErr_addr1 && !this.showErr_city && !this.showErr_fullname && !this.showErr_state){
      var tempZip='47906';
      console.log("user creds", this.CongoCredits);
      if(!(this.CongoCredits == 0)){
        if((this.CongoCredits - this.total) > 0){
          var congoCredObs = this._httpService.PurchaseWithCongoCredit(this.userID,this.total);
          congoCredObs.subscribe(data=>{
            console.log(data);
            console.log("success ",data['success']);
            if(data['success']==1){
              var orderObs=this._httpService.createOrder(this.userID,this.address_lineone,this.city,this.state,tempZip,this.shipping,this.tax);
              orderObs.subscribe(data=>{
                console.log("order resp",data);
                if(data['success']==1){
                  localStorage.setItem('_COID',data['order']['tempID']);
                  var total = (data['order']['total']).toString();
                  localStorage.setItem('_t',total);
                  var shipping = (data['order']['shipping']).toString();
                  localStorage.setItem('_s',shipping);
                  var subt = (Math.floor((data['order']['total'] - data['order']['shipping']) * 100) / 100).toString();
                  localStorage.setItem('_st',subt);
                  this._router.navigate(['checkout-conf']);
                }else{
                  //failure
                }
              })
            }else if(data['success'] == 2){
              //customer made a partial purchase
              console.log("partial purchase is a go");
              this.total = data['cost'];
              this.total = Math.floor(this.total * 100) / 100;
              this.CongoCredits = 0;
  
            }else{
              this.showErr_credits = true;
            }
          })
        }else{
          if (this.full_name.length < 2){
            this.showErr_fullname = true;
          }else{
          this.showErr_fullname = false;
          }
      
      
         if (this.address_lineone.length < 5){
          this.showErr_addr1 = true;
         }else{
           this.showErr_addr1 = false;
         }
      
      
      
        if(this.selectedCCYear == null){
          this.showErr_year = true;
        }else{
          var year = this.selectedCCYear.toString();
          if (year.length != 2){
            this.showErr_year = true;
           }else{
             this.showErr_year = false;
           }
        }
      
         if (this.city.length < 4){
          this.showErr_city = true;
         }else{
           this.showErr_city = false;
         }
      
      
        if (this.state.length < 2){
          this.showErr_state = true;
        }else{
          this.showErr_state = false;
        }
      
      
          if(this.cc_number == null) {
            this.showErr_ccNumber = true;
          }else{
      
            this.str_cc_number = this.cc_number.toString();
            if(this.str_cc_number.length < 16){
              this.showErr_ccNumber = true;
            }else{
            this.showErr_ccNumber = false;
            }
          }
      
          if(this.cvv_code == null){
            this.showErr_cvvCode = true;
          }else {
      
            this.str_cvv_code = this.cvv_code.toString();
            if(this.str_cvv_code.length < 3 || this.str_cvv_code.length > 4){
              this.showErr_cvvCode = true;
            }else{
              this.showErr_cvvCode = false;
            }
          }
      
      
      
          if(this.phone_num.length != 10 ){
            //this.showErr_phoneNumber = true;
          }else{
            this.showErr_phoneNumber = false;
          }
      
      
      
          if(this.email.match(/^\S+@\S+\.\S/) == null){
            // if(this.email.match())
      
            this.showErr_email = true;
          }else{
            this.showErr_email = false;
          }
      
          if( !this.showErr_addr1 && !this.showErr_city  && !this.showErr_fullname && !this.showErr_state ){
              console.log("shipping info");
              var tempZip='47906';
      
              var congoCredObs = this._httpService.PurchaseWithCongoCredit(this.userID,this.total);
              congoCredObs.subscribe(data=>{
                console.log(data);
                console.log("success ",data['success']);
                if(data['success']==1){
                  var orderObs=this._httpService.createOrder(this.userID,this.address_lineone,this.city,this.state,tempZip,this.shipping,this.tax);
                  orderObs.subscribe(data=>{
                    console.log("order resp",data);
                    if(data['success']==1){
                      localStorage.setItem('_COID',data['order']['tempID']);
                      var total = (data['order']['total']).toString();
                      localStorage.setItem('_t',total);
                      var shipping = (data['order']['shipping']).toString();
                      localStorage.setItem('_s',shipping);
                      var subt = (Math.floor((data['order']['total'] - data['order']['shipping']) * 100) / 100).toString();
                      localStorage.setItem('_st',subt);
                      this._router.navigate(['checkout-conf']);
                    }else{
                      //failure
                    }
                  })
                }else if(data['success'] == 2){
                  //customer made a partial purchase
                  console.log("partial purchase is a go");
                  this.total = data['cost'];
                  this.total = Math.floor(this.total * 100) / 100;
                  this.CongoCredits = 0;
                  var stripeObs = this._httpService.stripePurchase(this.cc_number,this.selectedCCDate,this.selectedCCYear,this.str_cvv_code,this.total*100);
                  stripeObs.subscribe(data=>{
                    if(data['success'] == 1){
                      var orderObs=this._httpService.createOrder(localStorage.getItem('userID'), this.address_lineone, this.city, this.state, tempZip, this.shipping, this.tax)
                      orderObs.subscribe(orderdata=>{
                        console.log("Response:", orderdata)
                        if(orderdata['success']==1){
                          console.log("CART: ",this.cart);
                          this.cart.forEach(element => {
                            console.log("el ",element);
                            console.log("el id ", element['_id']);
                            var upObs=this._httpService.updateProductSold(element['_id']);
                            upObs.subscribe(data=>{
                              console.log("UPdate ",data);
                            })
                          });
                          //route to the confirmation page
                            localStorage.setItem('_COID',orderdata['order']['tempID']);
                          var total = (orderdata['order']['total']).toString();
                          localStorage.setItem('_t',total);
                          var shipping = (orderdata['order']['shipping']).toString();
                          localStorage.setItem('_s',shipping);
                          var subt = (Math.floor((orderdata['order']['total'] - orderdata['order']['shipping']) * 100) / 100).toString();
                          
                          localStorage.setItem('_st',subt);
                          this._router.navigate(['checkout-conf']);
                        }else{
                          //server error
                        }
                      })
                    }else{
                      //stripe error
                      this.show_fail = true;
                      this.stripe_resp = data['display_message'];
                    }
                  })
                }else{
                  this.showErr_credits = true;
                }
              })



             
            }
        }
        
      }
     
    }
  }

}
