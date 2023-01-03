import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    vistorHistory(): Observable<any> {
        const url = `${this.baseUrl}/vistor-history`

        return this.http.get<any>(url)
    }
    dashboardData(): Observable<any> {
        const url = `${this.baseUrl}/dashboard`

        return this.http.get<any>(url)
    }

    salesPerMonth(params): Observable<any> {
        const url = `${this.baseUrl}/sales-report`

        return this.http.post<any>(url, params)
    }

}
