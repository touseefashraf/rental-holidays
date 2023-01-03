import { IRangeSliderModule } from './../../libs/irange-slider/irange-slider.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from './../shared/shared.module'
import { NgModule } from '@angular/core'
import { IndexComponent } from './index.component'
import { RouterModule } from '@angular/router'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { DataService } from './data.service'
import { apis } from 'src/environments/environment'
import { AgmCoreModule } from '@agm/core'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

@NgModule({
    imports: [
        AutocompleteLibModule,
        IRangeSliderModule,
        ModalModule.forRoot(),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: IndexComponent }
        ]),
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
    ],
    declarations: [IndexComponent],
    providers: [DataService]
})
export class IndexModule { }