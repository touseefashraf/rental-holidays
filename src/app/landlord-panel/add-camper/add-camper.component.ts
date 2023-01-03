import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-lender-registration',
    templateUrl: './add-camper.component.html',
    styleUrls: ['./add-camper.component.css']
})
export class AddCamperComponent implements OnInit {

    constructor(public api: ApiService) { }

    ngOnInit() {
        this.api.headerType = "black"
    }

}
