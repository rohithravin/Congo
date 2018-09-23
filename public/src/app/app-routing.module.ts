import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantaddComponent } from './merchantadd/merchantadd.component'

const routes: Routes = [
  {path: 'addProduct', component:MerchantaddComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
