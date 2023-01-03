import { apis } from './../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
@Injectable({ providedIn: 'root' })
export class DataService {

    private baseUrl = `${apis.baseUrl}/landlord`
    constructor(public http: HttpClient) { }

    getMyBooking(): Observable<any> {
        const url = `${this.baseUrl}/my-booking-requests`

        return this.http.get<any>(url)
    }

    vehicleImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/vehicle-image/${id}`
    }
    vehicleMainImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/vehicle-main-image/${id}`
    }
    request(param): Observable<any> {

        const url = `${this.baseUrl}/booking-request-response`

        return this.http.post<any>(url, param)
    }
    cancelReq(param): Observable<any> {

        const url = `${this.baseUrl}/cancel-booking-request`

        return this.http.post<any>(url, param)
    }
}
