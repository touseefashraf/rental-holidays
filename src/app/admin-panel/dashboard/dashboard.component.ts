import { IAlertService } from './../../libs/ialert/ialerts.service';
import { ApiService } from './../../services/api.service'
import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment'
import { ConstantsService } from 'src/app/services/constants.service';


@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    mt = moment
    month = ''

    constructor(
        private api: ApiService,
        public ds: DataService,
        public cs: ConstantsService,
        public alert: IAlertService
    ) {
       
    }

    ngOnInit() {

       
      
    }
   
    logOut(): void {
        this.api.logOutSession().subscribe((resp: any) => {
            const check = this.api.logOut()
            if (check) {
                location.reload()
            }
        })
    }
}
