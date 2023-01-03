import { DataService } from './data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFavouriteComponent } from './my-favourite.component';
import { RouterModule } from '@angular/router';
import {LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    RouterModule.forChild([
        { path: '', component: MyFavouriteComponent }
    ])
  ],
  declarations: [MyFavouriteComponent],
  providers:[DataService]
})
export class MyFavouriteModule { }
