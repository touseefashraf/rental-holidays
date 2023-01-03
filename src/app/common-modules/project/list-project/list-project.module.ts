import { ProjectLoaderComponent } from './project-loader/project-loader.component'
import { AdminSharedModule } from './../../../admin-panel/admin-shared/admin-shared.module'
import { ListProjectComponent } from './list-project.component'
import { IAlertsModule } from '../../../libs/ialert/ialerts.module'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { ModalModule } from 'ngx-bootstrap/modal'
import { SharedModule } from '../../../website/shared/shared.module'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ImageCropperModule } from 'ngx-image-cropper'
import { ReactiveFormsModule } from '@angular/forms'
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { DataService } from './data.service'

@NgModule({
  imports: [
    ImageCropperModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ReactiveFormsModule,
    IAlertsModule,
    LazyLoadImageModule,
    RouterModule.forChild([
        { path: '', component: ListProjectComponent }
    ])
  ],
  declarations: [ListProjectComponent,ProjectLoaderComponent],
  providers: [ DataService ]
})
export class ListProjectModule { }
