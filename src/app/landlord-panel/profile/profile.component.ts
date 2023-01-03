import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef } from '@angular/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'
import * as moment from 'moment'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { MapsAPILoader } from '@agm/core'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [DataService]
})
export class ProfileComponent implements OnInit {
    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    public searchControl: FormControl
    profileFG: FormGroup
    planholderList: any = []
    updateLoading = false
    lat: any = null
    lng: any = null
    activeMenu: string
    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        private dataService: DataService,
        public api: ApiService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private mapsAPILoader: MapsAPILoader
    ) {
        const user = this.api.user
    }

    get g() {
        return this.profileFG.controls
    }

    ngOnInit() {
        /*this.api.getPlanholdersList().subscribe((resp: any) => {
            if (resp.success == true) {
                this.planholderList = resp.data
                console.log(this.planholderList)

            }
        })*/
        this.activeMenu = 'profile'
        const user = this.api.user
        this.profileFG = this.fb.group({
            first_name: new FormControl(user.first_name, [Validators.required, Validators.maxLength(100)]),//
            last_name: new FormControl(user.last_name, [Validators.required, Validators.maxLength(100)]),//
            contact: new FormControl(user.contact, [Validators.required, Validators.maxLength(15)]),//
            contact_2: new FormControl(user.landlord.contact_2, [Validators.maxLength(15)]),//
            address: new FormControl(user.landlord.address, [Validators.required, Validators.maxLength(500)]),//
            // plan_holder_id: new FormControl(user.landlord.plan_holder_id, [Validators.required]),
        })
        this.autoCom()
    }
    test(obj) {
        console.log(obj)

    }
    save(data: any): boolean {
        this.updateLoading = true
        console.log('data', data.value)
        if (data.status === 'INVALID') {
            this.alert.error('Please fill valid data and try again')
            this.updateLoading = false


            return false
        }
        this.dataService.updateProfile(data.value).subscribe((resp: any) => {

            if (resp.success == true) {

                this.alert.success('Profile updated successfully')
                localStorage.setItem('user', JSON.stringify(resp.data))
                this.api.user = resp.data
                this.updateLoading = false
            }
        })
    }
    getLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lng = position.coords.longitude
                this.lat = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.lat, this.lng)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.profileFG.controls.address.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }
    autoCom(): void {
        this.searchControl = new FormControl()
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                this.lat = place.geometry.location.lat()
                this.lng = place.geometry.location.lng()
                this.profileFG.controls.address.setValue(place.formatted_address)

            })
        })
    }
}
