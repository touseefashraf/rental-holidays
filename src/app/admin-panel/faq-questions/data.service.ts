import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
   private baseUrl = `${apis.baseUrl}`
   constructor(private http: HttpClient) { }

   getFaq(params): Observable<any> {
      const url = `${this.baseUrl}/admin/faqs`

      return this.http.get<any>(url, { params })
   }

   addFaq(params): Observable<any> {
      const url = `${this.baseUrl}/admin/save-faq`

      return this.http.post<any>(url, params)
   }

   updateFaq(params): Observable<any> {
      const url = `${this.baseUrl}/admin/update-faq`

      return this.http.post<any>(url, params)
   }

   deleteFaq(params): Observable<any> {
      const url = `${this.baseUrl}/admin/delete-faq`

      return this.http.post<any>(url, params)
   }
}
