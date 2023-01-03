import { Router } from '@angular/router'
import { DataService } from './../data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

@Component({
    selector: 'app-camper-details',
    templateUrl: './camper-details.component.html',
    styleUrls: ['./camper-details.component.css']
})
export class CamperDetailsComponent implements OnInit {
    camperDetailsForm: FormGroup
    user: any
    vehicleId: number

    constructor(
        public ui: UIHelpers,
        private fb: FormBuilder,
        private alert: IAlertService,
        public ds: DataService,
        private router: Router
    ) { }

    ngOnInit() {
        this.user = JSON.parse(localStorage.user)
        this.vehicleId = this.user.vehicle.id
        this.camperDetailsForm = this.fb.group({
            id: new FormControl(null),
            make: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
            model: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
            allowed_weight: new FormControl(null, [Validators.required]),
            no_beds: new FormControl(null, [Validators.required]),
        })
        if (this.vehicleId) {

            this.ds.vehicleDetails(this.vehicleId).subscribe((resp: any) => {

                this.camperDetailsForm.patchValue(resp.data)
            })

        }



    }

    get g() {
        return this.camperDetailsForm.controls
    }

    save(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }

        const params = data.value


        params.id = this.user.vehicle.id
        params.vehicle_type_id = this.user.vehicle.vehicle_type_id

        this.ds.saveCamperDetails(params).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                // this.user = JSON.parse(localStorage.user)
                // this.ds.data.vehicle_details.vehicle_id = resp.data.id
                // this.ds.data.vehicle_details.make = resp.data.make
                // this.ds.data.vehicle_details.model = resp.data.model
                // this.ds.data.vehicle_details.allowed_weight = resp.data.allowed_weight
                // this.ds.data.vehicle_details.no_beds = resp.data.no_beds
                // console.log(resp.data);

                this.alert.success('Camper Details Added Successfully')
                this.router.navigateByUrl(`/lender-registration/camper-profile`)
            }
        })
    }
}
