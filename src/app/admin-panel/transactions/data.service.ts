import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`
    constructor(private http: HttpClient) { }

    listTransaction(params): Observable<any> {
        const url = `${this.baseUrl}/admin/transaction-history`

        return this.http.get<any>(url, { params })
    }
    searchUsers(params): Observable<any> {
        const url = `${this.baseUrl}/admin/landlords`

        return this.http.get<any>(url, { params: { keyword: params } })
    }
}
