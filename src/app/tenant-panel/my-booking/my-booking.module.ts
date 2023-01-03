import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MyBookingComponent } from './my-booking.component'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        SharedModule,
        RouterModule.forChild([
            { path: '', component: MyBookingComponent }
        ])
    ],
    declarations: [MyBookingComponent],
    providers: [DataService]
})
export class MyBookingModule { }
