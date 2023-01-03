import { ActivatedRoute, Router } from '@angular/router'
import { DataService } from './data.service'
import { FormGroup } from '@angular/forms'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { IAlertService } from '../../libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MapsAPILoader } from '@agm/core'
import * as moment from 'moment'

@Component({
    selector: 'app-search',
    templateUrl: './camper-search.component.html',
    styleUrls: ['./camper-search.component.css']
})
export class CamperSearchComponent implements OnInit, OnDestroy {
    @ViewChild('location', { static: false }) public searchElementRef: ElementRef
    @Input() modalRef: BsModalRef
    data: any
    exploreLoading = false
    buyLoading = false
    subscriptionLoading = false
    getQuoteLoading = false
    companyImagesData = []
    lastImageId = 0
    totalImageDataLength = 0
    intervalValue: any
    lang: any
    lat: any = null
    lng: any = null
    location: any = null
    paramsToUpdate: any
    vehiclesSearchList: Array<any> = []
    featureslist: any = []
    vehicleTypeslist: any = []
    totalVehicles: any = null
    locationString: ''
    filters: any = {
        no_beds: '',
        no_seats: '',
        price_per_night: '',
        vehicle_type_id: '',
        amenity_id: '',
        lat: '',
        lng: '',
        pickup_date: '',
        return_date: '',
        radius: ''
    }
    beds = [1, 2, 3, 4, 5]
    seats = [1, 2, 3, 4, 5]
    distance = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
    minDate: Date
    spinnerSVG = `/assets/images/Dring.svg`

    constructor(
        public api: ApiService,
        public alert: IAlertService,
        private ms: BsModalService,
        private mapsAPILoader: MapsAPILoader,
        public ds: DataService,
        private router: Router,
        public route: ActivatedRoute
    ) {
        this.minDate = new Date()
        this.minDate.setDate(this.minDate.getDate())
        this.api.activeTab = ''
        this.lang = this.api.translate('website.FAQ')
        console.log(this.lang)

        this.route.queryParams.subscribe(params => {
            if (params.lat === undefined && params.lng === undefined && params.pickup_date === undefined && params.return_date === undefined) {
                this.filters.lat = ''
                this.filters.lng = ''
                this.filters.pickup_date = ''
                this.filters.return_date = ''
            } else {
                this.filters.lat = params.lat
                this.filters.lng = params.lng
                this.filters.pickup_date = params.pickup_date
                this.filters.return_date = params.return_date
                this.locationString = params.location
            }
            // console.log(this.filters.lat, this.filters.lng)
            // console.log(this.filters.pickup_date, this.filters.return_date)
            // console.log(this.locationString)
        })
    }

    ngOnInit() {
        this.ds.featureslist().subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.featureslist = resp.data
            }
        })

        this.ds.vehicleTypeslist().subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            }

            if (resp.success === true) {
                this.vehicleTypeslist = resp.data
            }
        })

        this.autoCom()

        if (this.locationString === undefined) {
            this.filters.radius = ''
        } else {
            this.filters.radius = this.distance[0]
        }
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalValue)
    }

    openModal(modal, index) {
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-lg modal-dialog-centered website',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    autoCom(): void {
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                this.filters.lat = place.geometry.location.lat()
                this.filters.lng = place.geometry.location.lng()
                console.log('lat', this.filters.lat, 'lng', this.filters.lng)
                this.location = place.formatted_address
            })
        })
    }

    search() {
        const paramsToSend: any = { ...this.filters }
        paramsToSend.pickup_date = moment(paramsToSend.pickup_date).format('YYYY-MM-DD')
        paramsToSend.return_date = moment(paramsToSend.return_date).format('YYYY-MM-DD')
        if (paramsToSend.pickup_date === 'Invalid date' && paramsToSend.return_date === 'Invalid date') {
            paramsToSend.pickup_date = ''
            paramsToSend.return_date = ''
        }
        this.ds.vehiclesSearch(paramsToSend).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.vehiclesSearchList = resp.data.data
                this.totalVehicles = resp.data.total
                // console.log('totalVehicles', this.totalVehicles)
                console.log('searchList', this.vehiclesSearchList)
                this.router.navigate(['/camper-search'], { queryParams: paramsToSend, replaceUrl: true })
            }
        })
    }

    searchDetail(vehicleId: any) {
        console.log(vehicleId)
        this.router.navigate(['/camper-details'], { queryParams: { id: vehicleId }, replaceUrl: true })

    }

    cancel() {
        this.modalRef.hide()
    }

}
