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
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private api: ApiService,
    ) {

         this.ds.vehicle_list().subscribe((resp: any) => {
            if (resp.success === true) {
                resp.data.forEach(vehicle => {
                    vehicle.isSelected=false
                    this.vehicle_list.push(vehicle)

                });
                console.log(this.vehicle_list);

            }
        })

    }

    vehicle(id: number) {
        this.vehicle_list.map(vehicleType => {
            if (vehicleType.id == id) {
                vehicleType.isSelected = true
                this.ds.vehicle_type_id=id
                this.nextBtn=false
            } else {
                vehicleType.isSelected = false
            }
        })
    }

    ngOnInit() {
    }

}

