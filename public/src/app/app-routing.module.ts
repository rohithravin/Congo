import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component'
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutConfComponent } from './checkout-conf/checkout-conf.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { MerchantLoginComponent } from './merchant-login/merchant-login.component';
import { MerchantPortalComponent } from './merchant-portal/merchant-portal.component';

const routes: Routes = [
  {path:'', component:HomepageComponent},
  // {path:'cart', component: CartComponent},
  // {path:'checkout', component: CheckoutComponent },
  // {path:'checkout-conf', component: CheckoutConfComponent },
  // {path:'user-login', component: UserLoginComponent },
  // {path:'merchant-login', component: MerchantLoginComponent },
  // {path:'merchant-portal', component: MerchantPortalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
