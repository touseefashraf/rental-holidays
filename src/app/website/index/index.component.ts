import { Router } from '@angular/router'
import { MapsAPILoader } from '@agm/core'
import { DataService } from './data.service'
import { IAlertService } from './../../libs/ialert/ialerts.service'
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import * as moment from 'moment'

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
    @ViewChild('location', { static: false }) public searchElementRef: ElementRef
    @Input() modalRef: BsModalRef
    data: any
    // modalRef: BsModalRef
    exploreLoading = false
    buyLoading = false
    subscriptionLoading = false
    getQuoteLoading = false
    companyImagesData = []
    lastImageId = 0
    totalImageDataLength = 0
    intervalValue: any
    lang: any
    location: any = null
    filters: any = {
        lat: '',
        lng: '',
        pickup_date: '',
        return_date: '',
        location: ''
    }
    minDate: Date
    constructor(
        public api: ApiService,
        public alert: IAlertService,
        private ms: BsModalService,
        public ds: DataService,
        private mapsAPILoader: MapsAPILoader,
        private router: Router
    ) {
        this.minDate = new Date()
        this.minDate.setDate(this.minDate.getDate())
        this.autoCom()
        this.api.activeTab = ''
        this.lang = this.api.translate('website.FAQ')
        console.log(this.lang)
    }
    ngOnInit() {
        this.api.headerType = 'white'
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
    cancel() {
        this.modalRef.hide()
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
                this.location = place.formatted_address
                this.filters.location = place.formatted_address
            })
        })
    }

    search() {
        const paramsToSend: any = { ...this.filters }
        paramsToSend.pickup_date = moment(paramsToSend.pickup_date).format('YYYY-MM-DD')
        paramsToSend.return_date = moment(paramsToSend.return_date).format('YYYY-MM-DD')

        if (this.filters.pickup_date === '' && this.filters.return_date === '') {
            this.alert.error('Please select fields')

            return false
        }
        if (paramsToSend.pickup_date < moment().format('YYYY-MM-DD')) {
            this.alert.error('Pickup date should not less than current date')

            return false
        }
        if (paramsToSend.pickup_date > paramsToSend.return_date) {
            this.alert.error('Pickup date should not greater than return date')

            return false
        }

        this.router.navigate(['/camper-search'], { queryParams: paramsToSend, replaceUrl: true })
    }
}
