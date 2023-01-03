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
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-camper-location',
    templateUrl: './camper-location.component.html',
    styleUrls: ['./camper-location.component.css']
})

export class CamperLocationComponent implements OnInit, AfterViewInit {
    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    @Input() modalRef: BsModalRef
    public searchControl: FormControl

    lat: any
    lng: any
    mapLat: any
    mapLng: any
    location: any
    profileFG: FormGroup
    mapLink: any = ""
    vehicleId: any = ""
    Loading = false
    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        public ds: DataService,
        public api: ApiService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private mapsAPILoader: MapsAPILoader,
        private router: Router,
        private route:ActivatedRoute,
        private _sanitizer: DomSanitizer
    ) {

        this.vehicleId = this.route.snapshot.paramMap.get('vehId')
        const params = {
            vehicle_id: this.vehicleId
        }
        this.profileFG = this.fb.group({
            location: new FormControl(this.location, [Validators.required, Validators.maxLength(255)]),
            lat: new FormControl(null, []),
            lng: new FormControl(null, [])
        })

        this.ds.vehicleDetails(this.vehicleId).subscribe((resp: any) => {
            this.profileFG.patchValue(resp.data)
            this.lat= +resp.data.lat
            this.lng= +resp.data.lng
            this.mapLat = +resp.data.lat
            this.mapLng = +resp.data.lng
            this.ds.data.vehicle_details.lng=resp.data.lng
            console.log(this.lat,this.lng);
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
        this.Loading=true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill valid data and try again')
            this.Loading=false
            return false
        }
        if (this.lng == null || this.lat == null) {
            this.alert.error('Please Select location from auto suggestion')
            this.Loading=false
            return false
        }
        data.value.lng = this.lng
        data.value.lat = this.lat
        data.value.id = +this.vehicleId

        this.ds.saveCamperLocation(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.Loading=false
                return false
            } else {
                this.Loading=false
                this.alert.success('Location Added Successfully')
                this.router.navigate(['../../camper-conditions/' + this.vehicleId], { relativeTo: this.route })
                // this.router.navigateByUrl(`/lender/add-vehicles/thanks-msg`)
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
