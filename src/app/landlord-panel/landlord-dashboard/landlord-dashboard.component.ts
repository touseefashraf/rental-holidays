import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-landlord-dashboard',
    templateUrl: './landlord-dashboard.component.html',
    styleUrls: ['./landlord-dashboard.component.css']
})
export class LandlordDashboardComponent implements OnInit {

    constructor(private api: ApiService) { }

    ngOnInit() {
    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }
}
