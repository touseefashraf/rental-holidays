import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`

    constructor(
        public http: HttpClient
    ) { }

    vehiclesSearch(params): Observable<any> {
        const url = `${this.baseUrl}/vehicles`

        return this.http.get<any>(url, { params })
    }

    featureslist(): Observable<any> {
        const url = `${this.baseUrl}/amenity-list`

        return this.http.get<any>(url)
    }

    vehicleTypeslist(): Observable<any> {
        const url = `${this.baseUrl}/vehicle-types`

        return this.http.get<any>(url)
    }

    ImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/vehicle-main-image/${id}`
    }

    profileImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/profile-image/${id}`
    }
}
