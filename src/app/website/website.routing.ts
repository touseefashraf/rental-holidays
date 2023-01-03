import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component'
import { WebsiteComponent } from './website.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { WebsiteGuard } from '../auth/website-guard'
import { NoAuthGuard } from '../auth/no-auth-guard'

const routes: Routes = [
    {
        path: '',
        component: WebsiteComponent,
        canActivate: [WebsiteGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./index/index.module')
                    .then(mod => mod.IndexModule)
            },
            {
                path: 'login',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./login/login.module')
                    .then(mod => mod.LoginModule)
            },
            {
                path: 'registration',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./registration/registration.module')
                    .then(mod => mod.RegistrationModule)
            },
            {
                path: 'contact-us',
                loadChildren: () => import('./contact-us/contact-us.module')
                    .then(mod => mod.ContactUsModule)
            },
            {
                path: 'about-us',
                loadChildren: () => import('./about-us/about-us.module')
                    .then(mod => mod.AboutUsModule)
            },
            {
                path: 'terms-and-conditions',
                loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module')
                    .then(mod => mod.TermsAndConditionsModule)
            },
            {
                path: 'privacy-policy',
                loadChildren: () => import('./privacy-policy/privacy-policy.module')
                    .then(mod => mod.PrivacyPolicyModule)
            },
            {
                path: 'how-it-works',
                loadChildren: () => import('./how-it-works/how-it-works.module')
                    .then(mod => mod.HowItWorksModule)
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('./forgot-password/forgot-password.module')
                    .then(mod => mod.ForgotPasswordModule)
            },
            {
                path: 'faq',
                loadChildren: () => import('./faq/faq.module')
                    .then(mod => mod.FaqModule)
            },
            {
                path: 'reset-password/:code',
                loadChildren: () =>
                    import('./reset-password/reset-password.module').then(
                        mod => mod.ResetPasswordModule
                    )
            },
            {
                path: 'payment-process/:message/:cartId',
                loadChildren: () =>
                    import('./payment-process/payment-process.module').then(
                        mod => mod.PaymentProcessModule
                    )
            },
            {
                path: 'set-password/:code',
                loadChildren: () =>
                    import('./set-password/set-password.module').then(
                        mod => mod.SetPasswordModule
                    )
            },
            {
                path: 'verify-email/:code',
                loadChildren: () => import('./verify-email/verify-email.module')
                    .then(mod => mod.VerifyEmailModule)
            },
            {
                path: 'lender-registration',
                loadChildren: () => import('./lender-registration/lender-registration.module')
                    .then(mod => mod.LenderRegistrationModule)
            },
            {
                path: 'lender-estimate',
                loadChildren: () => import('./lender-estimate/lender-estimate.module')
                    .then(mod => mod.LenderEstimateModule)
            },
            {
                path: 'camper-details',
                loadChildren: () => import('./camper-details/camper-details.module')
                    .then(mod => mod.CamperDetailsModule)
            },
            {
                path: 'camper-search',
                loadChildren: () => import('./camper-search/camper-search.module')
                    .then(mod => mod.CamperSearchModule)
            },
            {
                path: '**',
                component: PageNotFoundComponent,
                data: { message: 'Sorry, we can’t seem to find what you’re looking for.' }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebsiteRoutes { }
