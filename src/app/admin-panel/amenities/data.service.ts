import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`
    constructor(private http: HttpClient) { }

    list(): Observable<any> {
        const url = `${this.baseUrl}/admin/amenity-list`

        return this.http.get<any>(url)
    }
    add(params): Observable<any> {
        const url = `${this.baseUrl}/admin/add-amenity`

        return this.http.post<any>(url, params)
    }
    update(params): Observable<any> {
        const url = `${this.baseUrl}/admin/update-amenity`

        return this.http.post<any>(url, params)
    }
    delete(params): Observable<any> {
        const url = `${this.baseUrl}/admin/delete-amenity`
        return this.http.post<any>(url, params)
    }
}
