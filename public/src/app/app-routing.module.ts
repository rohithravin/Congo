import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component'
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
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { MerchantaddComponent } from './merchantadd/merchantadd.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { StreamRegistrationComponent } from './stream-registration/stream-registration.component';
import { AdminMerchantsComponent} from './admin-merchants/admin-merchants.component';
import { UserOrderHistoryComponent } from './user-order-history/user-order-history.component';
import { MerchantOrdersComponent } from './merchant-orders/merchant-orders.component';
import { MerchantStatsComponent } from './merchant-stats/merchant-stats.component';
import { AdminStatsComponent } from './admin-stats/admin-stats.component';
import { GiftCardComponent } from './gift-card/gift-card.component';
import { GiftCardVerifyComponent } from './gift-card-verify/gift-card-verify.component';
import { GiftCardConfirmationComponent } from './gift-card-confirmation/gift-card-confirmation.component';
import { HelpDeskComponent } from './help-desk/help-desk.component';

const routes: Routes = [
  {path:'', component:HomepageComponent},
  {path:'cart', component: CartComponent},
  {path:'checkout', component: CheckoutComponent },
  {path:'checkout-conf', component: CheckoutConfComponent },
  {path:'login', component: UserLoginComponent },
  {path:'merchant/login', component: MerchantLoginComponent },
  {path:'merchant/portal', component: MerchantPortalComponent },
  {path:'merchant/products', component: MerchantProductComponent },
  {path: 'product/:pid', component: ProductComponent},
  {path: 'search/:searchQuery', component: SearchComponent},
  {path: 'registration', component: UserRegComponent},
  {path: 'dummyAdd', component:DummyAddProductComponent},
  {path: 'promote/:pid', component: PromoteProductRegComponent},
  {path: 'merchant/register', component: MerchantReg1Component},
  {path: 'merchant/register2', component: MerchantReg2Component},
  {path: 'merchant-reg-conf', component: MerchantRegConfComponent},
  {path: 'merchantadd', component: MerchantaddComponent},
  {path: 'orders', component: PurchaseHistoryComponent},
  {path: 'gift-card', component: GiftCardComponent},
  {path: 'admin/login', component: AdminLoginComponent},
  {path: 'admin', component: AdminPortalComponent},
  {path: 'stream/register', component:StreamRegistrationComponent},
  {path: 'admin/merchants', component: AdminMerchantsComponent},
  {path: 'giftcard/redeem', component: GiftCardVerifyComponent},
  {path: 'order/:orderid', component: UserOrderHistoryComponent},
  {path: 'merchant/orders', component: MerchantOrdersComponent},
  {path: 'giftcard/confirmation', component: GiftCardConfirmationComponent},
  {path: 'merchant/stats', component: MerchantStatsComponent},
  {path: 'admin/stats', component: AdminStatsComponent},
  {path: 'help-desk', component: HelpDeskComponent}
   //Path any, = home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
