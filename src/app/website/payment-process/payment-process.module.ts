import { RouterModule } from '@angular/router';
import { DataService } from './/data.service';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentProcessComponent } from './payment-process.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path:'',component:PaymentProcessComponent
    }])
  ],
  declarations: [PaymentProcessComponent],
  providers:[DataService]
})
export class PaymentProcessModule { }
