import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MerchantaddComponent } from './merchantadd/merchantadd.component';
import { MerchantproductComponent } from './merchantproduct/merchantproduct.component';

@NgModule({
  declarations: [
    AppComponent,
    MerchantaddComponent,
    MerchantproductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
