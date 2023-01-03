import { DataService } from './data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { MyMessagesComponent } from './my-messages.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module';

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: MyMessagesComponent }
        ])
    ],
    declarations: [MyMessagesComponent],
    providers:[DataService]
})
export class MyMessagesModule { }
