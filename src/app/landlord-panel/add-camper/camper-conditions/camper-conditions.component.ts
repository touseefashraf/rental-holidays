import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from '../data.service';

@Component({
    selector: 'app-camper-conditions',
    templateUrl: './camper-conditions.component.html',
    styleUrls: ['./camper-conditions.component.css']
})
export class CamperConditionsComponent implements OnInit {
    camperDetailsForm: FormGroup
    user: any
    vehicleId: any
    vehicle_type_id: any
    Loading = false
    constructor(
        public ui: UIHelpers,
        private fb: FormBuilder,
        private alert: IAlertService,
        public ds: DataService,
        private router: Router,
        public route: ActivatedRoute,
    ) {
        this.camperDetailsForm = this.fb.group({


            driving_license_possesion: new FormControl(null, [Validators.required]),
            deposite_amount: new FormControl(null, [Validators.required]),
            tenant_min_age: new FormControl(null, [Validators.required]),
            other_condition: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            animals_allowed: new FormControl(null, [Validators.required]),
            smoking_allowed: new FormControl(null, [Validators.required]),
            driving_license: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(1150)]),
            additional_equipment: new FormControl(null, [Validators.required, Validators.maxLength(1150)]),

        })

    }

    ngOnInit() {
        this.vehicleId = this.route.snapshot.paramMap.get('vehId')
        console.log('ID', this.vehicleId);
        if (this.vehicleId != null) {
            this.ds.vehicleDetails(this.vehicleId).subscribe((resp: any) => {
                this.camperDetailsForm.patchValue(resp.data.rental_conditions)
                this.camperDetailsForm.controls.description.patchValue(resp.data.description)
                this.camperDetailsForm.controls.additional_equipment.patchValue(resp.data.additional_equipment)
            })
        }
    }
    get g() {
        return this.camperDetailsForm.controls
    }
    save(data: any, f: any) {
        console.log(data);
        this.Loading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.Loading = false
            return false
        }
        const params = data.value
        // data.value.description='There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'
        // data.value.additional_equipment='There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'
        params.id = +this.vehicleId

        this.ds.saveCamperConditions(params).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.Loading = false
                return false
            } else {
                this.Loading = false
                console.log(resp.data)
                this.alert.success('Camper Details Added Successfully')
                // this.router.navigate(['../../camper-profile/' + resp.data.id], { relativeTo: this.route })
                this.router.navigateByUrl(`/lender/add-vehicles/thanks-msg`)

            }
        })

    }

}
