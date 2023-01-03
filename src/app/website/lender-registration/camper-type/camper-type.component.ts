import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from '../data.service';

@Component({
    selector: 'app-camper-type',
    templateUrl: './camper-type.component.html',
    styleUrls: ['./camper-type.component.css']
})
export class CamperTypeComponent implements OnInit {
    selected_vehicle_id = -1
    modalRef: BsModalRef
    lenderForm: FormGroup
    nextBtn: boolean = true;
    vehicle_list: any=[];
    spinnerSVG = `/assets/images/spinner.svg`


    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private api: ApiService,
    ) {
        this.lenderForm = this.fb.group({
            id: new FormControl(null),
            email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(60)]),
            password: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
            password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
            gender: new FormControl(null, [Validators.required]),
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            last_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            contact: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            dob: new FormControl(null, [Validators.required]),
            agree: new FormControl(null, [Validators.required]),
        })

         this.ds.vehicle_list().subscribe((resp: any) => {
            if (resp.success === true) {
                // this.vehicle_list = resp.data
                resp.data.forEach(vehicle => {
                    vehicle.isSelected=false
                    this.vehicle_list.push(vehicle)

                });
                console.log(this.vehicle_list);

            }
        })

    }
    vehicle(id) {
        let temp=this.vehicle_list
        this.vehicle_list=[]
        temp.forEach(veh => {
            if (veh.id==id) {
                veh.isSelected=true
                this.selected_vehicle_id=id
                console.log(this.selected_vehicle_id);
                this.nextBtn=false

            }
            else{
                veh.isSelected=false
            }
            this.vehicle_list.push(veh)

        });

    }

    ngOnInit() {
    }
    get g() {
        return this.lenderForm.controls
    }

    openModalBank(bankModal) {

        this.modalRef = this.ms.show(
            bankModal,
            {
                class: 'modal-md modal-dialog-centered website reg-modal',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    save(f) {
        if (this.lenderForm.get('password').value!=this.lenderForm.get('password_confirmation').value) {
            this.alert.error('Password must be same')

            return false
        }



        if (this.lenderForm.status === 'INVALID') {
            this.alert.error('Please enter valid lenderForm in all fields and try again')

            return false
        }
        const params = {
            id: this.lenderForm.value.id,
            gender: this.lenderForm.value.gender,
            first_name: this.lenderForm.value.first_name,
            last_name: this.lenderForm.value.last_name,
            email: this.lenderForm.value.email,
            password: this.lenderForm.value.password,
            password_confirmation:this.lenderForm.value.password_confirmation,
            contact: this.lenderForm.value.contact,
            vehicle_type_id:this.selected_vehicle_id,
            dob: moment(this.lenderForm.value.dob).format('YYYY-MM-DD').toString()
        }
        this.ds.addLender(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.alert.success(' added successfully')
                // this.ds.data.vehicle_details.vehicle_type_id=this.selected_vehicle_id
                // this.ds.data.vehicle_details.user_id=resp.data.landlord.id
                // this.ds.data.vehicle_details.vehicle_id=resp.data.vehicle.id
                // console.log(this.ds.data);
                localStorage.setItem('token', resp.data.token)
                localStorage.setItem('user', JSON.stringify(resp.data))
                this.api.userLoggedInSource.next(true)


                this.router.navigateByUrl(`/lender-registration/camper-details`)
                f.resetForm()
                this.modalRef.hide()
            }
            else {
                this.alert.error(resp.errors.general)

            }
        })

        // if (this.lenderForm.status === 'INVALID') {
        //     this.alert.error('Please enter valid lenderForm in all fields and try again')

        //     return false
        // }


        // this.ds.addLender(this.lenderForm.value).subscribe((resp: any) => {
        //     if (resp.success === true) {
        //         this.alert.success(' added successfully')
        //         f.resetForm()
        //         this.router.navigateByUrl(`/lender-registration/camper-details`)
        //         this.modalRef.hide()
        //     }
        //     else {
        //         this.alert.error(resp.errors.general)

        //     }
        // })
    }
    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

}

