import { ActivatedRoute, Router } from '@angular/router'
import { IAlertService } from '../../libs/ialert/ialerts.service'
import { UIHelpers } from '../../helpers/ui-helpers'
import { DataService } from './data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-landlords',
    templateUrl: './landlords.component.html',
    styleUrls: ['./landlords.component.css']
})
export class LandlordsComponent implements OnInit {

    dataStatus = 'fetching'
    listlandlordData = []
    selectedIndex = -1
    searchForm: FormGroup
    modalRef: BsModalRef
    loginLoading = false
    pagination: any = []
    page = 1
    searchKey: any = ''
    loaderOptions = {
        rows: 3,
        cols: 6,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ms: BsModalService,
        public route: ActivatedRoute,
        private router: Router,

    ) {

        this.getUsersList()
        // Search form
        this.searchForm = this.fb.group({
            name: new FormControl(null, [Validators.required]),
        })
    }
    search(f: any) {
        this.searchKey = this.searchForm.value.name
        this.getUsersList()
    }
    reset(f: any) {
        this.searchKey = ''
        this.getUsersList()
    }


    getUsersList() {

        const params = {
            name: this.searchKey
        }
        const listlandlord = this.ds.listlandlord(params)
        listlandlord.subscribe((resp: any) => {
            if (resp.success === true) {
                this.listlandlordData = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/landlords'], { queryParams: {}, replaceUrl: true })
            }
        })
    }

    get g() {
        return this.searchForm.controls
    }

    setPagination(page: number) {
        let filtersParam: any = {}
        filtersParam = { page }
        this.router.navigate(['/admin/landlords'], { queryParams: filtersParam, replaceUrl: true })
    }

    openModal(modal, index) {

        this.selectedIndex = index
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            id: this.listlandlordData[this.selectedIndex].id
        }
        const deleteEntry = this.ds.delete(params)
        deleteEntry.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false
                return false
            } else {

                this.listlandlordData.splice(this.selectedIndex, 1)
                this.alert.success('Entry Deleted successfully!!')
            }
            this.modalRef.hide()
        })
    }

    updateStatus(f: any) {
        this.loginLoading = true
        const params = {
            id: this.listlandlordData[this.selectedIndex].id,
            status: (this.listlandlordData[this.selectedIndex].status == 'active' ? 'inactive' : 'active')
        }
        const updateStatus = this.ds.updateStatus(params)
        updateStatus.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false
                return false
            } else {

                this.listlandlordData[this.selectedIndex].status = params.status
                this.alert.success('Status updated successfully!!')
                this.loginLoading = false
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
    ngOnInit() {

    }
}
