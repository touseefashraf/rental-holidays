import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-lender-registration',
    templateUrl: './lender-registration.component.html',
    styleUrls: ['./lender-registration.component.css']
})
export class LenderRegistrationComponent implements OnInit {

    constructor(public api: ApiService) { }

    ngOnInit() {
        this.api.headerType = "black"
    }

}
