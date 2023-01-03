import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './data.service';

@Component({
    selector: 'app-booking-request',
    templateUrl: './booking-request.component.html',
    styleUrls: ['./booking-request.component.css']
})
export class BookingRequestComponent implements OnInit {
    dataStatus: string;
    myBooking: any;
    acceptForm: FormGroup
    rejectForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: any;
    Loading: boolean;
    selectedId: any;

    constructor(
        private ds: DataService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public router: Router,
        private route: ActivatedRoute,
    ) {
        this.acceptForm = this.fb.group({
            booking_request_id: new FormControl(null),
            response_note: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
        })
        this.rejectForm = this.fb.group({
            booking_request_id: new FormControl(null),
            response_note: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
        })
        this.dataStatus = 'fetching'
        this.ds.getMyBooking().subscribe((resp: any) => {
            if (resp.success == true) {
                this.myBooking = resp.data
                console.log('my booking', this.myBooking)
                this.dataStatus = 'done'
            }
        })
    }

    ngOnInit() {
    }
    openModal(adderModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.acceptForm.controls.booking_request_id.setValue(this.myBooking[index].id)
            this.acceptForm.patchValue(this.myBooking[index])
        }
        this.modalRef = this.ms.show(
            adderModal,
            {
                class: 'modal-md modal-dialog-centered ',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    openModalReject(adderModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.rejectForm.controls.booking_request_id.setValue(this.myBooking[index].id)
            this.rejectForm.patchValue(this.myBooking[index])
        }
        this.modalRef = this.ms.show(
            adderModal,
            {
                class: 'modal-md modal-dialog-centered ',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm modal-dialog-centered ',
        backdrop: 'static',
        ignoreBackdropClick: true,
        keyboard: false })
    }
    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

    approveRequest(f: any) {
        this.Loading = true
        if (this.acceptForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.Loading = false

            return false
        }
        const params =this.acceptForm.value
         params.status= 'approved',



        this.ds.request(params).subscribe((resp: any) => {
            this.Loading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.Loading = false

                return false
            } else {
                this.myBooking[this.selectedIndex].status = 'approved'
                this.alert.success('Request Approved successfully!!')
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }
    rejectRequest(f: any) {
        this.Loading = true
        if (this.rejectForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.Loading = false

            return false
        }

        const params =this.rejectForm.value
        params.status= 'rejected',

        this.ds.request(params).subscribe((resp: any) => {
            this.Loading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.Loading = false

                return false
            } else {
                this.myBooking[this.selectedIndex].status = 'rejected'
                this.alert.success('Request Rejected successfully!!')
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }
    cancel() {
        this.Loading = true
        const params = {
            booking_request_id: this.selectedId
        }
        this.ds.cancelReq(params)
            .subscribe((resp: any) => {
                this.Loading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    this.Loading = false
                    return false
                } else {
                    this.myBooking[this.selectedIndex].status = 'CBL'
                    this.modalRef.hide()
                    this.alert.success('cancelled successfully!!')
                    this.selectedIndex = -1
                }
            })
    }

}
