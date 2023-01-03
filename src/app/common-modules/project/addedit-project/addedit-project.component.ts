import { IAlertService } from '../../../libs/ialert/ialerts.service'
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core'
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { UIHelpers } from '../../../helpers/ui-helpers'
import { ApiService } from '../../../services/api.service'
import { DataService } from './data.service'
import * as moment from 'moment'
import { MapsAPILoader } from '@agm/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
@Component({
    selector: 'app-addedit-project',
    templateUrl: './addedit-project.component.html',
    styleUrls: ['./addedit-project.component.css']
})
export class AddeditProjectComponent implements OnInit, OnDestroy {
    @ViewChild('searchProjectLoc', { static: false }) public searchProjectLocElementRef: ElementRef
    @ViewChild('searchPreBidLoc', { static: false }) public searchPreBidLocElementRef: ElementRef
    @ViewChild('searchBidLoc', { static: false }) public searchBidLocElementRef: ElementRef
    fetching = false
    moment = moment
    minDate = new Date()
    // dataService.selectedId: any
    selectedIndex = -1
    projectForm: FormGroup
    projectDetails: any
    operations = 'sale'
    dataStatus = 'fetching'
    markAsNew = true
    markAsUpdate = false
    csiDivisionIds: Array<number> = []
    public searchControl: FormControl
    projectLat: any = null
    projectLng: any = null
    preBidLat: any = null
    preBidLng: any = null
    bidLat: any = null
    bidLng: any = null
    modalRef: BsModalRef
    deletePop: any
    isLoading = false
    constructor(
        public fb: FormBuilder,
        public dataService: DataService,
        public ui: UIHelpers,
        public api: ApiService,
        private alert: IAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private mapsAPILoader: MapsAPILoader,
        public ms: BsModalService,
        // private changeDetector : ChangeDetectorRef
    ) {
        // this.changeDetector.detectChanges()
        this.projectForm = this.fb.group({
            mark_as_new: new FormControl(null, []),
            mark_as_update: new FormControl(null, []),
            update_description: new FormControl(null, []),
            id: new FormControl(null, []),
            title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),//
            solicitation: new FormControl(null, [Validators.required, Validators.maxLength(50)]),//
            bid_amount: new FormControl(0, [Validators.min(0)]),//
            project_location: new FormControl(null, [Validators.maxLength(255), Validators.minLength(4)]),//
            bid_method: new FormControl(null, [Validators.required, Validators.maxLength(255)]),//
            bid_date: new FormControl(null, [Validators.required]),//
            bidTime: new FormControl(null, [Validators.required]),//
            preBidMeetingTime: new FormControl(null, [Validators.required]),//
            // bid_phase: new FormControl('open', [Validators.required]),//
            completion_time: new FormControl(null, [Validators.required]),//
            notes: new FormControl(null, [Validators.maxLength(500)]),//
            pre_bid_date: new FormControl(null, [Validators.required]),//
            pre_bid_location: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),//
            min_bid: new FormControl(0, [Validators.required, Validators.min(0)]),//
            max_bid: new FormControl(0, [Validators.required, Validators.min(0)]),//
            doc_availability: new FormControl(null, []),//
            qto_id: new FormControl(null, [Validators.required]),//
            liquidated_damages: new FormControl(null, [Validators.required]),//
            b_bond: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),//
            p_bond: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),//
            pay_bond: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),//
            bid_location: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.minLength(4)]),//
            project_owner_id: new FormControl(null, [Validators.required]),//
            youtube_link: new FormControl(null, []),
            description: new FormControl(null, []),
            project_type: new FormControl(null, [Validators.required]),
            user_id: new FormControl(null, []),
            mbe: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
            wbe: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
            eeo: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
            sdvob: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),

        })
        this.setValidator()
        this.dataService.loadLovs()
        this.autoComProjectLocation()
        this.autoComPreBidLocation()
        this.autoComBidLocation()
        this.route.queryParams.subscribe((params: any) => {
            if (params.id) {
                this.dataService.selectedId = params.id
            }
            if (params.id > -1 && params.step) {
                this.dataService.step = params.step
            }
        })
        if (this.dataService.selectedId > -1) {
            this.initialize(this.dataService.selectedId)
        } else {
            this.getPlanHoldersData(-1)
            this.dataStatus = 'done'
        }
    }

    getPlanHoldersData(id) {
        this.dataService.projectPlanHolders({ project_id: id }).subscribe((resp: any) => {
            this.dataService.planHoldersList = resp.data
            this.dataService.planholderFetching = false
        })
    }

    // Project Location
    getProjectLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.projectLng = position.coords.longitude
                this.projectLat = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.projectLat, this.projectLng)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.projectForm.controls.project_location.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }

    autoComProjectLocation(): void {
        this.searchControl = new FormControl()
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchProjectLocElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                this.projectLat = place.geometry.location.lat()
                this.projectLng = place.geometry.location.lng()
                this.projectForm.controls.project_location.setValue(place.formatted_address)

            })
        })
    }
    // Project Location End

    // Pre Bid Location
    getPreBidLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.preBidLng = position.coords.longitude
                this.preBidLat = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.preBidLat, this.preBidLng)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.projectForm.controls.pre_bid_location.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }

    autoComPreBidLocation(): void {
        this.searchControl = new FormControl()
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchPreBidLocElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                this.preBidLat = place.geometry.location.lat()
                this.preBidLng = place.geometry.location.lng()
                this.projectForm.controls.pre_bid_location.setValue(place.formatted_address)

            })
        })
    }
    // Pre Bid Location End
    // Bid Location
    getBidLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.bidLng = position.coords.longitude
                this.bidLat = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.bidLat, this.bidLng)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.projectForm.controls.bid_location.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }

    autoComBidLocation(): void {
        this.searchControl = new FormControl()
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchBidLocElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                this.bidLat = place.geometry.location.lat()
                this.bidLng = place.geometry.location.lng()
                this.projectForm.controls.bid_location.setValue(place.formatted_address)

            })
        })
    }
    // Bid Location End

    setValidator() {
        this.projectForm.get('min_bid').valueChanges.subscribe((newVal: any) => {
            this.projectForm.get('min_bid').setValidators(Validators.max(this.projectForm.get('max_bid').value))
            this.projectForm.get('max_bid').setValidators(Validators.min(newVal))
            this.projectForm.get('max_bid').markAsTouched()
            this.projectForm.get('max_bid').updateValueAndValidity({ emitEvent: true })
        })
        this.projectForm.get('max_bid').valueChanges.subscribe((newVal: any) => {
            this.projectForm.get('max_bid').setValidators(Validators.min(this.projectForm.get('min_bid').value))
            this.projectForm.get('min_bid').setValidators(Validators.max(newVal))
            this.projectForm.get('min_bid').markAsTouched()
            this.projectForm.get('min_bid').updateValueAndValidity({ emitEvent: false })
        })

        this.projectForm.get('project_type').valueChanges.subscribe((newVal: any) => {
            if (newVal == 'private') {
                this.projectForm.get('user_id').setValidators(Validators.required)
            } else {
                this.projectForm.get('user_id').setValidators(null)
                this.projectForm.controls.user_id.setValue(null)
            }
            this.projectForm.get('user_id').markAsTouched()
            this.projectForm.get('user_id').updateValueAndValidity({ emitEvent: false })
        })
    }
    spliceAddCsiId(id: any) {
        const index = this.csiDivisionIds.findIndex(d => d == id)
        if (index > -1) {
            this.csiDivisionIds.splice(index, 1)
        } else {
            this.csiDivisionIds.push(+id)
        }
    }
    setMaxBidValidator() {
        this.projectForm.controls.max_bid.setValidators([Validators.min(this.projectForm.value.min_bid)])
    }

    checkcsiId(id: any) {
        const index = this.csiDivisionIds.findIndex(d => d == id)
        if (index > -1) {
            return true
        } else {
            return false
        }
    }

    get g() {
        return this.projectForm.controls
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.dataService.step = 'details'
        this.dataService.bidPhase = 'open'
    }

    initialize(id: number) {
        this.dataService.getProjectDetails(id).subscribe((resp: any) => {
            if (resp.success == true) {
                this.projectDetails = resp.data
                this.dataService.projectDetails = resp.data
                // if(this.api.user.user_type == 'deo'){
                //     this.projectDetails = resp.data.project_detail
                //     this.dataService.projectDetails = resp.data.project_detail
                //     }
                console.log('data', this.projectDetails)
                this.projectForm.patchValue(this.projectDetails)
                this.projectForm.controls.bidTime.setValue(new Date(this.projectDetails.bid_date))
                this.projectForm.controls.preBidMeetingTime.setValue(new Date(this.projectDetails.pre_bid_date))
                this.dataService.bidPhase = this.projectDetails.bid_phase
                console.log('dataservicess', this.dataService.bidPhase)
                this.projectDetails.project_csi_divisions.forEach(d => {
                    this.csiDivisionIds.push(+d.csi_division_id)
                })
                // plan holders work
                // this.dataService.projectPlanHolders({ project_id: id }).subscribe((resp: any) => {
                //     this.dataService.planHoldersList = resp.data
                //     this.dataService.planholderFetching = false
                //     console.log('responseeee', this.dataService.planHoldersList)
                //     resp.data.project_plan_holders.forEach(d => {
                //         const dataToPush = {
                //             id: +d.plan_holder_id,
                //             price: d.price
                //         }
                //         this.dataService.planholdersDataToSend.push(dataToPush)
                //     })
                // })
                // plan holders work end

                this.projectForm.controls.bid_date.setValue(new Date(this.projectForm.value.bid_date))
                this.projectForm.controls.pre_bid_date.setValue(new Date(this.projectForm.value.pre_bid_date))
                this.projectForm.controls.doc_availability.setValue(new Date(this.projectForm.value.doc_availability))
                this.dataStatus = 'done'
            }
        })
    }
    save(data: any, f: any): boolean {
        this.isLoading = true
        if (data.status === 'INVALID') {
            this.isLoading = false
            this.alert.error('Please enter valid data in all fields and try again')

            return false
        }

        if (this.csiDivisionIds.length == 0) {
            this.isLoading = false
            this.alert.error('Please Select atleast 1 CSI Division')

            return false
        }
        if (data.value.max_bid < data.value.min_bid) {
            this.isLoading = false
            this.alert.error('Max Bid can,t be less then Min Bid')

            return false
        }
        data.value.pre_bid_date = moment(data.value.pre_bid_date).format('YYYY-MM-DD ') + moment(data.value.preBidMeetingTime).format('HH:mm:ss')
        const currentDate = moment(new Date())
        data.value.bid_date = moment(data.value.bid_date).format('YYYY-MM-DD ') + moment(data.value.bidTime).format('HH:mm:ss')
        data.value.doc_availability = moment(data.value.doc_availability).format('YYYY-MM-DD 00:00:00')
        if ((moment(data.value.pre_bid_date)).diff(moment(currentDate)) < 0) {
            this.isLoading = false
            this.alert.error('Pre Bid Date and Time cant be Less then Now')

            return false
        }

        if ((moment(data.value.pre_bid_date)).diff(moment(data.value.bid_date)) > 0) {
            this.isLoading = false
            this.alert.error('Bid Date and Time cant be smaller then Pre Bid Date and Time')

            return false
        }
        delete data.value.preBidMeetingTime
        delete data.value.bidTime
        console.log('data.value', data.value);
        if (this.dataService.selectedId !== '-1') {
            data.value.id = +this.dataService.selectedId
        }
        data.value.csi_division_ids = this.csiDivisionIds
        // data.value.plan_holder_ids = this.planholdersDataToSend

        data.value.project_lat = this.projectLat
        data.value.project_lng = this.projectLng
        data.value.pre_bid_lat = this.preBidLat
        data.value.pre_bid_lng = this.preBidLng
        data.value.bid_lat = this.bidLat
        data.value.bid_lng = this.bidLng
        data.value.mark_as_new = this.markAsNew === true ? 1 : 0
        data.value.mark_as_update = this.markAsUpdate === true ? 1 : 0
        if (data.value.mark_as_update === true && data.value.update_description == null) {
            this.alert.error('Update description is required')
        }
        this.dataService.step1Data = data.value
        console.log('step data', this.dataService.step1Data)
        let saveMethod = this.dataService.save(this.dataService.step1Data)
        if (this.dataService.selectedId > -1) {
            saveMethod = this.dataService.update(this.dataService.step1Data)
        }
        saveMethod.subscribe((resp: any) => {
            this.isLoading = false
            if (resp.success == true) {
                if (this.dataService.selectedId > -1) {
                    this.alert.success('Project details updated successfully')
                } else {
                    this.dataService.step1Data.id = resp.data.id
                    this.alert.success('Project added successfully')
                }
                this.dataService.projectDetails = resp.data
                const navigateObj = {
                    id: resp.data.id,
                    step: 'planholders'
                }
                this.dataService.navigateWindow(navigateObj)
            } else {
                this.alert.error(resp.errors.general)
            }
        })
    }

    setOperation(value: any): void {
        this.operations = value
        this.projectForm.controls.operation.setValue(value)

    }

    cancel() {
        this.router.navigateByUrl('/admin/project/list')
    }

}
