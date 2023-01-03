import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TenantGuard } from '../auth/tenant-guard'
import { TenantPanelComponent } from './tenant-panel.component'


const routes: Routes = [
    {
        path: '',
        component: TenantPanelComponent,
        canActivate: [TenantGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./tenant-dashboard/tenant-dashboard.module')
                .then(mod => mod.TenantDashboardModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module')
                .then(mod => mod.ProfileModule)
            },
            {
                path: 'my-booking',
                loadChildren: () => import('./my-booking/my-booking.module')
                .then(mod => mod.MyBookingModule)
            },
            {
                path: 'my-favourite',
                loadChildren: () => import('./my-favourite/my-favourite.module')
                .then(mod => mod.MyFavouriteModule)
            },
            {
                path: 'change-password',
                loadChildren: () => import('./change-password/change-password.module')
                .then(mod => mod.ChangePasswordModule)
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TenantPanelRoutes { }
