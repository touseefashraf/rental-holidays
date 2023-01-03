import { ApiService } from 'src/app/services/api.service'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/${this.api.user.user_type}`

    constructor(public http: HttpClient, private api: ApiService) {
    }

    save(params: any): Observable<any> {
        const url = `${this.baseUrl}/save-project`

        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-project`

        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/delete-project`

        return this.http.post<any>(url, params)
    }

    list( params: any): Observable<any> {
        const url = `${this.baseUrl}/projects`

        return this.http.get<any>(url,{params})
    }

    sampleProject(params: any): Observable<any> {
        const url = `${this.baseUrl}/project-as-sample`

        return this.http.post<any>(url, params)
    }

    changeProjectStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-project-status`

        return this.http.post<any>(url, params)
    }

}
