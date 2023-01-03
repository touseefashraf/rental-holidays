import { AdminPanelComponent } from './admin-panel.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminGuard } from '../auth/admin-guard'

const routes: Routes = [
    {
        path: '',
        component: AdminPanelComponent,
        canActivate: [AdminGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module')
                    .then(mod => mod.DashboardModule)
            },
            {
                path: 'admin',
                loadChildren: () => import('./admin/admin.module')
                    .then(mod => mod.AdminModule)
            },
            {
                path: 'change-password',
                loadChildren: () => import('./change-password/change-password.module')
                    .then(mod => mod.ChangePasswordModule)
            },
            {
                path: 'contact-us',
                loadChildren: () => import('./contact-us/contact-us.module')
                    .then(mod => mod.ContactUsModule)
            },
            {
                path: 'blogs',
                loadChildren: () => import('./blogs/blogs.module')
                    .then(mod => mod.BlogsModule)
            },
            {
                path: 'faq-categories',
                loadChildren: () => import('./faq-categories/faq-categories.module')
                    .then(mod => mod.FaqCategoriesModule)
            },
            {
                path: 'faq-questions/:id',
                loadChildren: () => import('./faq-questions/faq-questions.module')
                    .then(mod => mod.FaqQuestionsModule)
            },
            {
                path: 'amenities',
                loadChildren: () => import('./amenities/amenities.module')
                    .then(mod => mod.AmenitiesModule)
            },
            {
                path: 'tanents',
                loadChildren: () => import('./tenants/tenants.module')
                    .then(mod => mod.TenantsModule)
            },
            {
                path: 'landlords',
                loadChildren: () => import('./landlords/landlords.module')
                    .then(mod => mod.LandlordsModule)
            },
            {
                path: 'transaction-history',
                loadChildren: () => import('./transactions/transactions.module')
                    .then(mod => mod.TransactionsModule)
            }

        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutes { }
