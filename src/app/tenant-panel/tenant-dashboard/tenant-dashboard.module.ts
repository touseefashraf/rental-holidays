import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import {TenantDashboardComponent } from './tenant-dashboard.component'
import { TenantSharedModule } from '../tenant-shared/tenant-shared.module'

@NgModule({
    imports: [
        TenantSharedModule,
        RouterModule.forChild([
            { path: '', component: TenantDashboardComponent }
        ])
    ],
    declarations: [TenantDashboardComponent]
})
export class TenantDashboardModule { }
