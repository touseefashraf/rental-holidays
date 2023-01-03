import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { HowItWorksComponent } from './how-it-works.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
        { path: '', component: HowItWorksComponent }
    ])
  ],
  declarations: [HowItWorksComponent]
})
export class HowItWorksModule { }
