import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`
    constructor(private http: HttpClient) { }

    listTenant(params): Observable<any> {
        const url = `${this.baseUrl}/admin/tenant-list`

        return this.http.get<any>(url,{params})
    }
    updateStatus(params): Observable<any> {
        const url = `${this.baseUrl}/admin/update-user-status`

        return this.http.post<any>(url, params)
    }
    delete(params): Observable<any> {
        const url = `${this.baseUrl}/admin/delete-user`
        return this.http.post<any>(url, params)
    }
}
