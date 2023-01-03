import { LazyLoadImageModule } from 'ng-lazyload-image'
import { DataService } from './data.service'
import { apis } from './../../../environments/environment'
import { AgmCoreModule } from '@agm/core'
import { ImageCropperModule } from 'ngx-image-cropper'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { ModalModule } from 'ngx-bootstrap/modal'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from './../../website/shared/shared.module'
import { LandLoardSharedModule } from './../landlord-shared/landlord-shared.module'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MyVehiclesComponent } from './my-vehicles.component'

@NgModule({
    imports: [
        CommonModule,
        LandLoardSharedModule,
        LazyLoadImageModule,
        SharedModule,
        FormsModule,
        NgScrollbarModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        ImageCropperModule,
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),

        RouterModule.forChild([
            { path: '', component: MyVehiclesComponent }
        ])
    ],
    declarations: [MyVehiclesComponent],
    providers: [DataService]
})
export class MyVehiclesModule { }
