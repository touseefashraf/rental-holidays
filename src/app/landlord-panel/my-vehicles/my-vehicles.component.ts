import { MapsAPILoader } from '@agm/core'
import { IAlertService } from './../../libs/ialert/ialerts.service'
import { BsModalService, ModalModule, BsModalRef } from 'ngx-bootstrap/modal'
import { ApiService } from './../../services/api.service'
import { DataService } from './data.service'
import { UIHelpers } from './../../helpers/ui-helpers'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-my-vehicles',
    templateUrl: './my-vehicles.component.html',
    styleUrls: ['./my-vehicles.component.css']
})
export class MyVehiclesComponent implements OnInit {

    dataStatus = 'fetching'
    loaderOptions = false
    searchControl: FormControl
    spinnerSVG = '/assets/images/Dring.svg'
    vehicleForm: FormGroup
    planholderList: any = []
    myVehicles: any = []
    updateLoading = false
    loginLoading = false
    modalRef: BsModalRef
    selectedIndex = -1
    lat: any = null
    lng: any = null
    activeMenu: string
    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        public dataService: DataService,
        public api: ApiService,
        private modalService: BsModalService,
        private alert: IAlertService,

    ) {

        this.dataStatus = 'fetching'
        this.dataService.getMyvehicles().subscribe((resp: any) => {

            if (resp.success == true) {
                this.myVehicles = resp.data
                console.log(this.myVehicles)
                this.dataStatus = 'done'
            }
        })
    }
    ngOnInit() {

    }
    get g() {
        return this.vehicleForm.controls
    }
    openModal(modal, index) {

        if (index > -1) {
        }

        this.selectedIndex = index

        this.modalRef = this.modalService.show(
            modal,
            {
                class: 'modal-sm modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            id: this.myVehicles[this.selectedIndex].id
        }
        const deleteEntry = this.dataService.delete(params)
        deleteEntry.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {

                this.myVehicles.splice(this.selectedIndex, 1)
                this.alert.success(' Deleted successfully!!')
            }
            this.modalRef.hide()
        })
    }

    cancelButton(f: any) {
        if (f) {
            f.resetForm()
        }

        this.modalRef.hide()
    }

}
