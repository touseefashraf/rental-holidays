import { ActivatedRoute, Router } from '@angular/router'
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
    vehicleId: any
    vehicle_type_id: any
    Loading = false
    amenityList = []
    selectedAmenity = []
    amenityIds: any[]

    constructor(
        public ui: UIHelpers,
        private fb: FormBuilder,
        private alert: IAlertService,
        public ds: DataService,
        private router: Router,
        public route: ActivatedRoute,
    ) {
        this.camperDetailsForm = this.fb.group({
            id: new FormControl(null),
            make: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            model: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            allowed_weight: new FormControl(null, [Validators.required]),
            no_beds: new FormControl(null, [Validators.required]),
            title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            fuel_type: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            transmission_type: new FormControl(null, [Validators.required]),
            no_gears: new FormControl(null, [Validators.required]),
            no_seats: new FormControl(null, [Validators.required]),
            registration_country: new FormControl(null, [Validators.required]),
            insured: new FormControl(null, [Validators.required]),
            camping_equipment: new FormControl(null, [Validators.required]),
        })

        this.ds.getAmenitesList().subscribe((resp: any) => {
            if (resp.success === true) {
                this.amenityList = resp.data
            }
        })

    }

    ngOnInit() {
        this.vehicle_type_id = this.route.snapshot.paramMap.get('vehType')
        console.log('type', this.vehicle_type_id);
        this.vehicleId = this.route.snapshot.paramMap.get('vehId')
        console.log('ID', this.vehicleId);
        if (this.vehicleId != null) {

            this.ds.vehicleDetails(this.vehicleId).subscribe((resp: any) => {
                this.camperDetailsForm.patchValue(resp.data)
                console.log(resp.data);
                this.vehicle_type_id = resp.data.vehicle_type_id
                this.selectedAmenity = []
                resp.data.vehicle_amenities.forEach((d: any) => {
                    const index = this.amenityList.findIndex(data => data.id == d.amenity_id)
                    if (index > -1) {
                        this.selectedAmenity.push(this.amenityList[index])
                        this.amenityList.splice(index, 1)
                    }
                })
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
        data.value.amenityIds = []
        this.selectedAmenity.forEach((d: any) => {
            data.value.amenityIds.push(d.id)
        })
        data.value.no_gears = +data.value.no_gears
        data.value.no_beds = +data.value.no_beds
        data.value.no_seats = +data.value.no_seats
        data.value.insured = +data.value.insured
        const params = data.value
        params.vehicle_type_id = +this.vehicle_type_id
        if (this.vehicleId == null) {
            params.id = ''
        }
        else {
            params.id = this.vehicleId

        }


        this.ds.saveCamperDetails(params).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                this.Loading = false
                return false
            } else {
                this.Loading = false
                console.log(resp.data)
                this.alert.success('Camper Details Added Successfully')
                // this.router.navigateByUrl(`/landlord/add-vehicles/camper-profile/`)
                this.router.navigate(['../../camper-profile/' + resp.data.id], { relativeTo: this.route })
            }
        })

    }
    addRemoveAmenity(d: any) {
        const index = this.amenityList.findIndex(data => data.id == d.id)
        const indexSelectedAmenity = this.selectedAmenity.findIndex(data => data.id == d.id)
        if (index > -1) {
            this.selectedAmenity.push(this.amenityList[index])
            this.amenityList.splice(index, 1)
            console.log('selected', this.selectedAmenity);
        }
        if (indexSelectedAmenity > -1) {
            this.amenityList.push(this.selectedAmenity[indexSelectedAmenity])
            this.selectedAmenity.splice(indexSelectedAmenity, 1)
            console.log('selected', this.selectedAmenity);
        }

    }
    back(){
        this.router.navigateByUrl(`/lender/my-vehicles`)
    }
}
