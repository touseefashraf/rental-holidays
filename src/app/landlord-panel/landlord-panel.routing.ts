import { LandLordGuard } from './../auth/landlord-guard';
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LandlordPanelComponent } from './landlord-panel.component'



const routes: Routes = [
    {
        path: '',
        component: LandlordPanelComponent,
        canActivate: [LandLordGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./landlord-dashboard/landlord-dashboard.module')
                .then(mod => mod.LandLoardDashboardModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module')
                .then(mod => mod.ProfileModule)
            },
            {
                path: 'change-password',
                loadChildren: () => import('./change-password/change-password.module')
                .then(mod => mod.ChangePasswordModule)
            },
            {
                path: 'my-vehicles',
                loadChildren: () => import('./my-vehicles/my-vehicles.module')
                .then(mod => mod.MyVehiclesModule)
            },
            {
                path: 'my-messages',
                loadChildren: () => import('./my-messages/my-messages.module')
                .then(mod => mod.MyMessagesModule)
            },
            {
                path: 'add-vehicles',
                loadChildren: () => import('./add-camper/add-camper.module')
                .then(mod => mod.AddCamperModule)
            },
            {
                path: 'booking-requests',
                loadChildren: () => import('./booking-request/booking-request.module')
                .then(mod => mod.BookingRequestModule)
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandLoardPanelRoutes { }
