import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/landlord`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    getMessages(): Observable<any> {
        const url = `${this.baseUrl}/messages`

        return this.http.get<any>(url)
    }

    chatDetails(id: number): Observable<any> {
        const url = `${this.baseUrl}/chat-detail?user_id=${id}`

        return this.http.get<any>(url)
    }
    sendMessage(params: any): Observable<any> {
        const url = `${this.baseUrl}/send-message`

        return this.http.post<any>(url, params)
    }

    deleteMsg(params): Observable<any> {
        const url = `${this.baseUrl}/delete-message`

        return this.http.post<any>(url, params)
    }
}
