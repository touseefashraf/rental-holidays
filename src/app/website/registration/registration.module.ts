import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from './../../website/shared/shared.module'
import { RegistrationComponent } from './registration.component'
import { Routes, RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { AgmCoreModule } from '@agm/core'
import { apis } from 'src/environments/environment.prod'
import { RecaptchaModule } from 'ng-recaptcha'

const routes: Routes = [
    { path: '', component: RegistrationComponent }
]
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RecaptchaModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
    ],
    declarations: [RegistrationComponent],
    providers: [DataService],
    exports: [RouterModule],
})
export class RegistrationModule { }
