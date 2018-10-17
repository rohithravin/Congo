import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component'
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutConfComponent } from './checkout-conf/checkout-conf.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { MerchantLoginComponent } from './merchant-login/merchant-login.component';
import { MerchantPortalComponent } from './merchant-portal/merchant-portal.component';
import { MerchantProductComponent } from './merchantproduct/merchantproduct.component';
import { SearchComponent } from './search/search.component';
import { ProductComponent } from './product/product.component';
import { UserRegComponent } from './user-reg/user-reg.component';
import { DummyAddProductComponent } from './dummy-add-product/dummy-add-product.component';
import {PromoteProductRegComponent} from './promote-product-reg/promote-product-reg.component';
import { MerchantReg1Component } from './merchant-reg1/merchant-reg1.component';
import { MerchantReg2Component } from './merchant-reg2/merchant-reg2.component';
import { MerchantRegConfComponent } from './merchant-reg-conf/merchant-reg-conf.component';

const routes: Routes = [
  {path:'', component:HomepageComponent},
  {path:'cart', component: CartComponent},
  {path:'checkout', component: CheckoutComponent },
  {path:'checkout-conf', component: CheckoutConfComponent },
  {path:'login', component: UserLoginComponent },
  {path:'merchant-login', component: MerchantLoginComponent },
  {path:'merchant-portal', component: MerchantPortalComponent },
  {path:'merchant-product', component: MerchantProductComponent },
  {path: 'product/:pid', component: ProductComponent},
  {path: 'search/:searchQuery', component: SearchComponent},
  {path: 'registration', component: UserRegComponent},
  {path: 'dummyAdd', component:DummyAddProductComponent},
  {path: 'promoteprod/:pid', component: PromoteProductRegComponent},
  {path: 'merchant-reg1', component: MerchantReg1Component},
  {path: 'merchant-reg2', component: MerchantReg2Component},
  {path: 'merchant-reg-conf', component: MerchantRegConfComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
