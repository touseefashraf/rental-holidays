import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { AddPlanholdersComponent } from './add-planholders/add-planholders.component';
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module';
import { AddQtoDocComponent } from './add-qto-doc/add-qto-doc.component';
import { AddAddendumDocComponent } from './add-addendum-doc/add-addendum-doc.component'
import { AddSpecDocComponent } from './add-spec-doc/add-spec-doc.component'
import { AddPlanDocComponent } from './add-plan-doc/add-plan-doc.component'
import { AddOtherDocComponent } from './add-other-doc/add-other-doc.component'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { StepsTemplateComponent } from './steps-template/steps-template.component'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { AddeditProjectComponent } from './addedit-project.component'
import { ImageCropperModule } from 'ngx-image-cropper'
import { SharedModule } from '../../../website/shared/shared.module'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { AgmCoreModule } from '@agm/core'
import { apis } from '../../../../environments/environment'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { TimepickerModule } from 'ngx-bootstrap/timepicker'


@NgModule({
    imports: [
        ImageCropperModule,
        SharedModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        LazyLoadImageModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
        RouterModule.forChild([
            { path: '', component: AddeditProjectComponent }
        ])
    ],
    declarations: [
        AddeditProjectComponent,
        AddSpecDocComponent,
        StepsTemplateComponent,
        AddPlanDocComponent,
        AddAddendumDocComponent,
        AddOtherDocComponent,
        AddQtoDocComponent,
        AddPlanholdersComponent
    ],
    providers: [DataService, FilterPipe],
    entryComponents: [AddeditProjectComponent]
})
export class AddeditProjectModule { }
