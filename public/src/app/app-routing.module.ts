import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutConfComponent } from './checkout-conf/checkout-conf.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { MerchantLoginComponent } from './merchant-login/merchant-login.component';

const routes: Routes = [
  {path:'cart', component: CartComponent},
  {path:'checkout', component: CheckoutComponent },
  {path:'checkout-conf', component: CheckoutConfComponent },
  {path:'user-login', component: UserLoginComponent },
  {path:'merchant-login', component: MerchantLoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
