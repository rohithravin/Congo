import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service'
import { AppRoutingModule } from './app-routing.module';
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
import { MerchantproductComponent } from './merchantproduct/merchantproduct.component'

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
    MerchantproductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
