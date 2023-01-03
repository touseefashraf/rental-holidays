import { DataService } from './data.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingRequestComponent } from './booking-request.component';
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
    imports: [
        AdminSharedModule,
        PopoverModule.forRoot(),
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        CommonModule,
        ModalModule.forRoot(),

        RouterModule.forChild([
            {
                path: '',
                component: BookingRequestComponent
            }

        ])

    ],
    declarations: [BookingRequestComponent],
    providers: [DataService]
})
export class BookingRequestModule { }
