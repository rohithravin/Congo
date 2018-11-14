import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service'
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { MerchantPortalComponent } from './merchant-portal/merchant-portal.component';
import { MerchantLoginComponent } from './merchant-login/merchant-login.component';
import { CheckoutConfComponent } from './checkout-conf/checkout-conf.component';
import { MerchantaddComponent } from './merchantadd/merchantadd.component';
import { MerchantProductComponent } from './merchantproduct/merchantproduct.component';
import { UserRegComponent } from './user-reg/user-reg.component';
import { DummyAddProductComponent } from './dummy-add-product/dummy-add-product.component';
import { PromoteProductRegComponent } from './promote-product-reg/promote-product-reg.component';
import { MerchantReg1Component } from './merchant-reg1/merchant-reg1.component';
import { MerchantReg2Component } from './merchant-reg2/merchant-reg2.component';
import { MerchantRegConfComponent } from './merchant-reg-conf/merchant-reg-conf.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { StreamRegistrationComponent } from './stream-registration/stream-registration.component';
import { AdminMerchantsComponent } from './admin-merchants/admin-merchants.component'
import { GiftCardComponent } from './gift-card/gift-card.component'
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    SearchComponent,
    ProductComponent,
    CartComponent,
    CheckoutComponent,
    UserLoginComponent,
    MerchantPortalComponent,
    MerchantLoginComponent,
    CheckoutConfComponent,
    MerchantaddComponent,
    MerchantProductComponent,
    UserRegComponent,
    DummyAddProductComponent,
    PromoteProductRegComponent,
    MerchantReg1Component,
    MerchantReg2Component,
    MerchantRegConfComponent,
    PurchaseHistoryComponent,
    AdminLoginComponent,
    AdminPortalComponent,
    StreamRegistrationComponent,
    AdminMerchantsComponent,
    GiftCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
