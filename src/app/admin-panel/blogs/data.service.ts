import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    constructor(private http: HttpClient) { }

    // stories Calls
    get(): Observable<any> {
        const url = `${this.baseUrl}/blogs`

        return this.http.get<any>(url)
    }

    delete(params): Observable<any> {
        const url = `${this.baseUrl}/delete-blog`

        return this.http.post<any>(url, params)
    }

    add(params): Observable<any> {
        const url = `${this.baseUrl}/add-blog`

        return this.http.post<any>(url, params)
    }

    update(params): Observable<any> {
        const url = `${this.baseUrl}/update-blog`

        return this.http.post<any>(url, params)
    }
}
