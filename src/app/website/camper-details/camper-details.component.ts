import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ActivatedRoute } from '@angular/router'
import { DataService } from './data.service'
import { AfterViewInit, Component, OnInit } from '@angular/core'
import { Lightbox } from 'ngx-lightbox'
import * as moment from 'moment'
import { MapsAPILoader } from '@agm/core'

@Component({
    selector: 'app-camper-details',
    templateUrl: './camper-details.component.html',
    styleUrls: ['./camper-details.component.css']
})
export class CamperDetailsComponent implements OnInit {
    dataStatus = 'fetching'
    user: any
    vehicleId: any
    camperDetailList: any = []
    vehicleImageId: any = null
    vehicleImageImages: any = []
    amenityList: any = []
    spinnerSVG = `/assets/images/Dring.svg`
    vehicleAmenty = []
    profileImgId: any
    albums: Array<any> = []
    request: any = {
        vehicle_id: '',
        start_date: '',
        end_date: ''
    }
    minDate: Date
    Loading = false
    bookLoading = false
    // currentLat: any = null
    // currentLng: any = null
    currentLat: any = 33.5518127
    currentLng: any = 73.1229894
    locationLat: any = null
    locationLng: any = null
    distance = null
    constructor(
        public ds: DataService,
        public route: ActivatedRoute,
        private lightbox: Lightbox,
        public alert: IAlertService,
        private mapsAPILoader: MapsAPILoader,
    ) {
        this.vehicleId = this.route.snapshot.queryParamMap.get('id')
        this.minDate = new Date()
        this.minDate.setDate(this.minDate.getDate())

        this.ds.camperDetails(this.vehicleId).subscribe((resp: any) => {
            if (resp.success) {
                this.camperDetailList = resp.data
                this.profileImgId = resp.data.user.id
                this.request.vehicle_id = resp.data.id
                this.locationLat = resp.data.lat
                this.locationLng = resp.data.lng
                resp.data.vehicle_amenities.forEach(element => {
                    this.vehicleAmenty.push(element.amenity.id)
                })
                this.dataStatus = 'done'
            } else {
                console.log('Camper Details INVALID')
            }
        })

        this.ds.amenityList().subscribe((resp: any) => {
            if (resp.success) {
                this.amenityList = resp.data
            } else {
                console.log('Amenity List INVALID')
            }
        })

        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(position => {
        //         this.currentLng = position.coords.longitude
        //         this.currentLat = position.coords.latitude
        //         this.mapsAPILoader.load().then(() => {
        //             const geocoder = new google.maps.Geocoder()
        //             const latlng = new google.maps.LatLng(this.currentLat, this.currentLng)
        //             const request = {
        //                 location: latlng
        //             }
        //             geocoder.geocode(request, (results, status) => {
        //                 const address = results[0].formatted_address
        //                 console.log('Address', address)
        //             })
        //         })
        //     })
        // } else {
        //     this.alert.error('Unable to get current location')
        // }
    }

    ngOnInit() {
        if (!this.locationLat && !this.locationLng) {
            // console.log('Location Called')
            this.getDistanceFromLatLonInKm()
        }
    }

    // getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    getDistanceFromLatLonInKm() {
        const R = 6371 // Radius of the earth in km
        const dLat = this.deg2rad(this.currentLat - this.locationLat)  // deg2rad below
        const dLon = this.deg2rad(this.currentLng - this.locationLng)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(this.locationLat)) * Math.cos(this.deg2rad(this.currentLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        this.distance = R * c // Distance in km
        // console.log('distance', this.distance)

    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    getCheck(id) {
        if (this.vehicleAmenty.indexOf(id) === -1) {
            return false
        } else {
            return true
        }
    }

    openGallery(images: any) {
        this.albums = []

        images.forEach(d => {
            const imageData = {
                src: this.ds.vehicleImages(d.id),
                caption: '',
                thumb: this.ds.vehicleImages(d.id)
            }
            this.albums.push(imageData)
        })

        this.open(0)
    }
    open(index: number): void {
        // open lightbox
        this.lightbox.open(this.albums, index, {
            alwaysShowNavOnTouchDevices: true,
            disableScrolling: true,
            albumLabel: '',
            wrapAround: true,
            showImageNumberLabel: true,
            centerVertically: true
        })
    }

    bookTravel(): any {
        console.log('bookTravel Function Called')
        this.bookLoading = true
        this.request.start_date = moment(this.request.start_date).format('YYYY-MM-DD')
        this.request.end_date = moment(this.request.end_date).format('YYYY-MM-DD')
        console.log('paramsToSend', this.request)

        if (this.request.start_date === '' && this.request.end_date === '') {
            this.alert.error('Please select fields')
            this.bookLoading = false

            return false
        }
        if (this.request.start_date < moment().format('YYYY-MM-DD')) {
            this.alert.error('Pickup date should not less than current date')
            this.bookLoading = false

            return false
        }
        if (this.request.start_date > this.request.end_date) {
            this.alert.error('Pickup date should not greater than return date')
            this.bookLoading = false

            return false
        }

        if (this.request.start_date === 'Invalid date' && this.request.end_date === 'Invalid date') {
            this.alert.error('Please select fields')
            this.request.start_date = ''
            this.request.end_date = ''
            this.bookLoading = false

            return false
        }

        this.ds.bookingTravelRequest(this.request).subscribe((resp: any) => {
            this.bookLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.bookLoading = false

                return false
            } else {
                this.alert.success('Your request has been sent successfully!!')
            }
        })
    }

    addFav(v_id) {
        this.Loading = true
        const params = {
            vehicle_id: v_id
        }
        this.ds.addFav(params).subscribe((resp: any) => {
            this.Loading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.Loading = false

                return false
            } else {
                this.alert.success('Added to Favourite!!')
                this.camperDetailList.favourite_vehicle = {
                    vehicle_id: this.vehicleId
                }
            }
        })
    }
    removeFav(v_id) {
        this.Loading = true
        const params = {
            vehicle_id: v_id
        }
        this.ds.removeFav(params).subscribe((resp: any) => {
            this.Loading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.Loading = false

                return false
            } else {
                this.alert.success('Removed from Favourite!!')
                this.camperDetailList.favourite_vehicle = null
            }
        })
    }
}
