import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-tenant-dashboard',
    templateUrl: './tenant-dashboard.component.html',
    styleUrls: ['./tenant-dashboard.component.css']
})
export class TenantDashboardComponent implements OnInit {

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
