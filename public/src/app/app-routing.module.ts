import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantaddComponent } from './merchantadd/merchantadd.component'
import { MerchantproductComponent } from './merchantproduct/merchantproduct.component';

const routes: Routes = [
  {path: 'addProduct', component:MerchantaddComponent},
  {path: 'merchantProduct', component:MerchantproductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
