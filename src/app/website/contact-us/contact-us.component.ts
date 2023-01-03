import { UIHelpers } from './../../helpers/ui-helpers'
import { Router, ActivatedRoute } from '@angular/router'
import { Component, OnInit, Input } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { apis } from '../../../environments/environment'

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
    googleCaptcha = ''
    siteKey = apis.googleCaptchaSiteKey
    @Input() index: number
    contactUs: FormGroup
    simpleError: string
    dataService: any
    isSubmitted = false as boolean
    formShow = true
    dataStatus = false
    Loading = false
    public resolved(captchaResponse: string) {
        this.googleCaptcha = captchaResponse
    }

    constructor(
        public apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService

    ) {
        this.apiService.activeTab = 'contactUs'
        this.contactUs = this.fb.group({
            id: new FormControl(null, []),
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(255)]),
            contact_no: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            subject: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            message: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
        })
        const params = {
            route: 'contact-us'
        }
    }

    ngOnInit() {
    }

    get g() {
        return this.contactUs.controls
    }
    replaceAll(str, find, replace) {
        const escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')

        return str.replace(new RegExp(escapedFind, 'g'), replace)
    }

    save(data: any): boolean {
        this.Loading = true
        if (data.status === 'INVALID' || this.googleCaptcha === '') {
            this.alert.error('Please eneter valid data in all fields and try again')
            this.Loading = false

            return false
        }

        const saveMethod = this.apiService.saveContactUs(data.value)

        saveMethod.subscribe((resp: any) => {
            this.Loading = false
            if (resp.success === false) {
                this.simpleError = resp.errors.general
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.formShow = false
                data.value.id = resp.data
                this.alert.success('Sended successfully!!')
                // this.apiService.saveContactUs(data.value)
                this.isSubmitted = true
            }
        })
    }
}
