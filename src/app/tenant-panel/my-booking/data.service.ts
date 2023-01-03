import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(
        public http: HttpClient
    ) { }

    tanentBookingRequestList(): Observable<any> {
        const url = `${apis.baseUrl}/tenant/my-booking-requests`

        return this.http.get<any>(url)
    }

    cancelBookingRequest(params: any): Observable<any> {
        const url = `${apis.baseUrl}/tenant/cancel-booking-request`

        return this.http.post<any>(url, params)
    }

    requestBookingSearch(params): Observable<any> {
        const url = `${apis.baseUrl}/tenant/my-booking-requests`

        return this.http.get<any>(url, { params })
    }

}
