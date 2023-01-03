import { HttpClient } from '@angular/common/http'
import { apis } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private baseUrl = `${apis.baseUrl}/tenant`
    status = new BehaviorSubject('')

    constructor(public http: HttpClient) { }
    camperDetails(id): Observable<any> {
        const url = `${apis.baseUrl}/public/vehicle-details/${id}`

        return this.http.get<any>(url)
    }

    amenityList(): Observable<any> {
        const url = `${apis.baseUrl}/public/amenity-list`

        return this.http.get<any>(url)
    }

    bookingTravelRequest(params): Observable<any> {
        const url = `${apis.baseUrl}/tenant/booking-request`

        return this.http.post<any>(url, params)
    }

    vehicleImages(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/vehicle-image/${id}`
    }

    profileImage(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/profile-image/${id}`
    }
    addFav(params): Observable<any> {
        const url = `${apis.baseUrl}/tenant/add-favourite-vehicle`

        return this.http.post<any>(url, params)
    }
    removeFav(params): Observable<any> {
        const url = `${apis.baseUrl}/tenant/remove-favourite-vehicle`

        return this.http.post<any>(url, params)
    }
}
