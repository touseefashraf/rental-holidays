import { SharedModule } from 'src/app/website/shared/shared.module'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CamperDetailsComponent } from './camper-details.component'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { LightboxModule } from 'ngx-lightbox'
import { FormsModule } from '@angular/forms'
import { AgmCoreModule } from '@agm/core'
import { apis } from 'src/environments/environment'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LazyLoadImageModule,
        FormsModule,
        LightboxModule,
        RouterModule.forChild([
            { path: '', component: CamperDetailsComponent }
        ]),
        BsDatepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
    ],
    declarations: [CamperDetailsComponent],
    providers: [DataService]
})
export class CamperDetailsModule { }
