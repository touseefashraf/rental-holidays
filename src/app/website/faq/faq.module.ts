import { SharedModule } from './../shared/shared.module'
import { FaqComponent } from './faq.component'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CollapseModule } from 'ngx-bootstrap/collapse'
import { DataService } from './data.service'

@NgModule({
   imports: [
      CommonModule,
      SharedModule,
      CollapseModule.forRoot(),
      RouterModule.forChild([
         { path: '', component: FaqComponent }
      ])
   ],
   declarations: [FaqComponent],
   providers: [DataService]
})
export class FaqModule { }
