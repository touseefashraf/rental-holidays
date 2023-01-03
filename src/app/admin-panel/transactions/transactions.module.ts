import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from '../../website/shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TransactionsComponent } from './transactions.component'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AutocompleteLibModule,
        AdminSharedModule,
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: TransactionsComponent }
        ])
    ],
    declarations: [TransactionsComponent],
    providers: [DataService]
})
export class TransactionsModule { }
