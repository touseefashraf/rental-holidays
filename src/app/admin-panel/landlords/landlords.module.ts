import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from '../../website/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { DataService } from './data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordsComponent } from './landlords.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminSharedModule,
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: LandlordsComponent }
        ])
    ],
    declarations: [LandlordsComponent],
    providers: [DataService]
})
export class LandlordsModule { }
