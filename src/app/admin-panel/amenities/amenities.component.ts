import { ActivatedRoute, Router } from '@angular/router'
import { IAlertService } from './../../libs/ialert/ialerts.service'
import { UIHelpers } from './../../helpers/ui-helpers'
import { DataService } from './data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, TemplateRef } from '@angular/core'

@Component({
    selector: 'app-amenities',
    templateUrl: './amenities.component.html',
    styleUrls: ['./amenities.component.css']
})
export class AmenitiesComponent implements OnInit {

    dataStatus = 'fetching'
    bankList = []
    listAmenities = []
    selectedIndex = -1
    addEditForm: FormGroup
    modalRef: BsModalRef
    loginLoading = false
    loaderOptions = {
        rows: 3,
        cols: 5,
        colSpans: {
            0: 1,
        }
    }
    selectedId: any

    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ms: BsModalService,
        public route: ActivatedRoute,
        private router: Router
    ) {

        const list = this.ds.list()
        list.subscribe((resp: any) => {
            if (resp.success === true) {
                this.listAmenities = resp.data
                this.dataStatus = 'done'
            }
        })

        // Set Leads Form fields
        this.addEditForm = this.fb.group({
            id: new FormControl(null),
            title_en: new FormControl(null, [Validators.required]),
            title_fr: new FormControl(null, [Validators.required]),
            title_de: new FormControl(null, [Validators.required]),
            title_nl: new FormControl(null, [Validators.required]),
            description_en: new FormControl(null),
            description_fr: new FormControl(null),
            description_de: new FormControl(null),
            description_nl: new FormControl(null)
        })


    }
    get g() {
        return this.addEditForm.controls
    }
    ngOnInit() {
    }

    openModal(modal, index) {
        this.selectedIndex = index
        console.log(this.selectedIndex);

        if (index > -1) {
            this.addEditForm.controls.id.setValue(this.listAmenities[index].id)
            this.addEditForm.patchValue(this.listAmenities[index])
        }

        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-lg modal-dialog admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    confirmingModal(template: TemplateRef<any>,  i: any) {
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    save(f: any) {
        this.loginLoading = true
        if (this.addEditForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.loginLoading = false
            return false
        }
        let saveUpdate = this.ds.add(this.addEditForm.value)

        if (this.addEditForm.value.id !== null) {
            saveUpdate = this.ds.update(this.addEditForm.value)
        }
        saveUpdate.subscribe((resp: any) => {

            this.loginLoading = false

            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {
                if (this.selectedIndex > -1) {
                    this.alert.success('Changes done successfully!!')
                    this.listAmenities[this.selectedIndex] = this.addEditForm.value
                    this.selectedIndex = -1

                } else {
                    this.alert.success('Added successfully!!')
                    this.listAmenities.push(this.addEditForm.value)
                }
                this.modalRef.hide()
                f.resetForm()
            }
        })

    }

    deleteEntry(f: any) {
        this.loginLoading = true
        const params = {
            id: this.listAmenities[this.selectedIndex].id
        }
        const deleteEntry = this.ds.delete(params)
        deleteEntry.subscribe((resp: any) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.loginLoading = false
                return false
            } else {

                this.listAmenities.splice(this.selectedIndex, 1)
                this.alert.success('Entry Deleted successfully!!')
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
