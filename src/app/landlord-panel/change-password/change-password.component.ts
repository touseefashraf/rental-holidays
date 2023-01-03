import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers';

import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    registrationError: string
    changePasswordForm: FormGroup
    newPass: any
    updateLoading = false
    conPass: any
    activeMenu: string;
    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        public ui: UIHelpers,
        private router: Router,
        private alert: IAlertService,
        public apiService: ApiService,
    ) {
        this.changePasswordForm = this.fb.group({
            old_password: new FormControl(null, [Validators.required]),
            new_password: new FormControl(null, [Validators.required]),
            new_password_confirmation: new FormControl(null, [Validators.required]),
        })
    }

    get g() {
        return this.changePasswordForm.controls
    }

    ngOnInit() {
        this.activeMenu = 'change-password'
    }

    changePassword(data: any): boolean {
        this.updateLoading = true
        this.newPass = this.changePasswordForm.get('new_password').value
        this.conPass = this.changePasswordForm.get('new_password_confirmation').value

        if (data.status === 'INVALID') {

            this.alert.error('Please fill valid Data and try again')
            this.updateLoading = false

            return false
        } else if (this.newPass !== this.conPass) {

            this.alert.error('Password doesnot match')
            this.updateLoading = false
            return false

        }
        console.log(data)
        this.dataService.changePassword(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.updateLoading = false
                return false
            } else {
                this.updateLoading = false
                this.alert.success('Password changed sucessfully')
            }
        })
    }

}
