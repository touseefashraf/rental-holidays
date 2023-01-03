import { LayoutModule } from './../../../landlord-panel/layout/layout.module';
import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'
import { MapsAPILoader } from '@agm/core'
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { DataService } from './../data.service';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
    selector: 'app-camper-location',
    templateUrl: './camper-location.component.html',
    styleUrls: ['./camper-location.component.css']
})

export class CamperLocationComponent implements OnInit, AfterViewInit {
    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    @Input() modalRef: BsModalRef
    public searchControl: FormControl

    lat: any = this.ds.data.vehicle_details.lat
    lng: any = this.ds.data.vehicle_details.lng
    mapLat: any = this.ds.data.vehicle_details.lat
    mapLng: any = this.ds.data.vehicle_details.lng
    location: any = this.ds.data.vehicle_details.location
    price_per_night: any = this.ds.data.vehicle_details.price_per_night
    profileFG: FormGroup
    mapLink: any = ""
    vehicleId: any = ""
    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        public ds: DataService,
        public api: ApiService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private mapsAPILoader: MapsAPILoader,
        private router: Router,
        private _sanitizer: DomSanitizer
    ) {
        this.vehicleId = api.user.vehicle.id
        this.profileFG = this.fb.group({
            location: new FormControl(this.location, [Validators.required, Validators.maxLength(255)]),
            lat: new FormControl(null, []),
            lng: new FormControl(null, [])
        })
        this.mapLink = 'https://maps.google.com/maps?q=' + this.lat + ',' + this.lng + '&hl=es&z=14&output=embed';
        this.mapLink = this._sanitizer.bypassSecurityTrustResourceUrl(this.mapLink)
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.autoCom()
    }
    save(data: any): boolean {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill valid data and try again')

            return false
        }
        if (this.lng == null || this.lat == null) {
            this.alert.error('Please Select location from auto suggestion')

            return false
        }
        data.value.lng = this.lng
        data.value.lat = this.lat
        data.value.id = this.vehicleId

        this.ds.saveCamperDetails(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.ds.data.personalInfo.email = ''
                this.ds.data.personalInfo.password = ''
                this.ds.data.vehicle_details.user_id = ''
                this.ds.data.vehicle_details.vehicle_id = -1
                this.ds.data.vehicle_details.vehicle_type_id = -1
                this.ds.data.vehicle_details.make= ''
                this.ds.data.vehicle_details.model = ''
                this.ds.data.vehicle_details.allowed_weight = ''
                this.ds.data.vehicle_details.no_beds = ''
                this.ds.data.vehicle_details.location = ''
                this.ds.data.vehicle_details.lat = null
                this.ds.data.vehicle_details.lng = null
                this.ds.data.vehicle_details.price_per_night = 1
                this.ds.data.vehicle_details. min_booking_period = 1
                this.alert.success('Location Added Successfully')
                this.router.navigateByUrl(`/lender-registration/thanks-msg`)
            }
        })
    }
    autoCom(): void {

        this.lat = ''
        this.lng = ''
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
                this.mapLat = this.lat
                this.mapLng = this.lng
                this.profileFG.controls.location.setValue(place.formatted_address)

                this.ds.data.vehicle_details.lat = this.lat
                this.ds.data.vehicle_details.lng = this.lng
                this.ds.data.vehicle_details.location = place.formatted_address

            })
        })
    }

    mapCenterChange(e) {
        //console.log('center changed', e)
        this.lat = e.lat
        this.lng = e.lng
        this.getAddress(e.lat, e.lng)
    }

    mapZoomChange(e) {
        //console.log('zoom changed', e)
    }

    getAddress(lat: number, lng: number) {
        if (navigator.geolocation) {
            let geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(lat, lng);
            let request = { location: latlng }
            geocoder.geocode(request, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    let result = results[0];
                    this.ds.data.vehicle_details.location = result.formatted_address
                    this.ds.data.vehicle_details.lat = lat
                    this.ds.data.vehicle_details.lng = lng

                    this.profileFG.controls.location.setValue(result.formatted_address)
                }
            })
        }
    }

    mapReady(e) {
        //console.log('map ready', e)
    }
}
