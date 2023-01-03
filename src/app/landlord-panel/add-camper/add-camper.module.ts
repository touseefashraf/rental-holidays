import { CamperConditionsComponent } from './camper-conditions/camper-conditions.component';
import { AddCamperComponent } from './add-camper.component';
import { apis } from 'src/environments/environment'
import { CamperTypeComponent } from './camper-type/camper-type.component';
import { DataService } from './data.service';
import { ThanksMsgComponent } from './thanks-msg/thanks-msg.component';
import { CamperLocationComponent } from './camper-location/camper-location.component';
import { CamperProfileComponent } from './camper-profile/camper-profile.component';
import { CamperDetailsComponent } from './camper-details/camper-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { ImageCropperModule } from 'ngx-image-cropper'
import { AgmCoreModule } from '@agm/core'
@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        ImageCropperModule,
        FormsModule,
        LazyLoadImageModule,
        ModalModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: AddCamperComponent,
                children: [
                    {
                        path: 'camper-type',
                        component: CamperTypeComponent
                    },
                    {
                        path: 'camper-details/:vehType',
                        component: CamperDetailsComponent
                    },
                    {
                        path: ':vehId/camper-details',
                        component: CamperDetailsComponent
                    },
                    {
                        path: 'camper-profile/:vehId',
                        component: CamperProfileComponent
                    },
                    {
                        path: 'camper-location/:vehId',
                        component: CamperLocationComponent
                    },
                    {
                        path: 'camper-conditions/:vehId',
                        component: CamperConditionsComponent
                    },
                    {
                        path: 'thanks-msg',
                        component: ThanksMsgComponent
                    }
                ]
            }
        ])
    ],
    declarations: [
        AddCamperComponent,
        CamperDetailsComponent,
        CamperProfileComponent,
        CamperLocationComponent,
        CamperConditionsComponent,
        ThanksMsgComponent,
        CamperTypeComponent
    ],
    providers: [DataService]
})
export class AddCamperModule { }
