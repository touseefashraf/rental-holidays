import { FaqQuestionsComponent } from './faq-questions.component';
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'

@NgModule({
  imports: [
    AdminSharedModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: FaqQuestionsComponent }
  ])
  ],
  declarations: [FaqQuestionsComponent],
  providers: [ DataService ]

})
export class FaqQuestionsModule { }



