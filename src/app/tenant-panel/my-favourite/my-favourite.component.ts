import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-my-favourite',
  templateUrl: './my-favourite.component.html',
  styleUrls: ['./my-favourite.component.css']
})
export class MyFavouriteComponent implements OnInit {


    dataStatus = 'fetching'
    loaderOptions = false
    spinnerSVG = '/assets/images/Dring.svg'
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

    removeEntry(f: any) {
        this.loginLoading = true
        const params = {
            vehicle_id: this.myVehicles[this.selectedIndex].vehicle.id
        }
        this.dataService.remove(params).subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false

                return false
            } else {

                this.myVehicles.splice(this.selectedIndex, 1)
                this.alert.success('Removed successfully!!')
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
