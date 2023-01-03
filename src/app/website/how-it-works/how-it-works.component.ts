import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-how-it-works',
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {

    constructor(
        public apiService: ApiService,
        private route: Router,
    ) { }

    ngOnInit() {
    }

}
