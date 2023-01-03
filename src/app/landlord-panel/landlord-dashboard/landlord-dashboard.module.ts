import { LandlordDashboardComponent } from './landlord-dashboard.component';
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { LandLoardSharedModule } from '../landlord-shared/landlord-shared.module';


@NgModule({
    imports: [
        LandLoardSharedModule,
        RouterModule.forChild([
            { path: '', component: LandlordDashboardComponent }
        ])
    ],
    declarations: [LandlordDashboardComponent]
})
export class LandLoardDashboardModule { }
