import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core'
import { BlogsComponent } from './blogs.component'
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { ImageCropperModule } from 'ngx-image-cropper'
import { AngularEditorModule, } from '@kolkov/angular-editor'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { DataService } from './data.service'

@NgModule({
  imports: [
    AdminSharedModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    ImageCropperModule,
    LazyLoadImageModule,
    AngularEditorModule,
    RouterModule.forChild([
      { path: '', component: BlogsComponent }
  ])
  ],
  declarations: [BlogsComponent],
  providers: [ DataService ]
})
export class BlogsModule { }
