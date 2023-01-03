import { apis } from './../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
@Injectable({ providedIn: 'root' })
export class DataService {

    private baseUrl = `${apis.baseUrl}/tenant`
    constructor(public http: HttpClient) { }

    getMyvehicles(): Observable<any> {
        const url = `${this.baseUrl}/favourite-vehicles`

        return this.http.get<any>(url)
    }
    remove(params): Observable<any> {
        const url = `${this.baseUrl}/remove-favourite-vehicle`

        return this.http.post<any>(url, params)
    }


    vehicleImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/vehicle-image/${id}`
    }
    vehicleMainImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/vehicle-main-image/${id}`
    }
}
