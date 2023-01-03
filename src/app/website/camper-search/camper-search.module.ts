import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { IRangeSliderModule } from '../../libs/irange-slider/irange-slider.module'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CamperSearchComponent } from './camper-search.component'
import { AgmCoreModule } from '@agm/core'
import { apis } from 'src/environments/environment'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { LazyLoadImageModule } from 'ng-lazyload-image'

@NgModule({
    imports: [
        AutocompleteLibModule,
        IRangeSliderModule,
        CommonModule,
        ModalModule.forRoot(),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
        RouterModule.forChild([
            { path: '', component: CamperSearchComponent }
        ]),
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
    ],
    declarations: [CamperSearchComponent],
    providers: [DataService]
})
export class CamperSearchModule { }
