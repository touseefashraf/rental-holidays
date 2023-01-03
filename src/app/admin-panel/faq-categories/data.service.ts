import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
   private baseUrl = `${apis.baseUrl}`
   constructor(private http: HttpClient) { }

   getFaqCategories(): Observable<any> {
      const url = `${this.baseUrl}/admin/faq-categories`

      return this.http.get<any>(url)
   }

   addFaqCategories(params): Observable<any> {
      const url = `${this.baseUrl}/admin/save-faq-cat`

      return this.http.post<any>(url, params)
   }

   updateFaqCategories(params): Observable<any> {
      const url = `${this.baseUrl}/admin/update-faq-cat`

      return this.http.post<any>(url, params)
   }

   deleteFaqCategories(params): Observable<any> {
      const url = `${this.baseUrl}/admin/delete-faq-cat`

      return this.http.post<any>(url, params)
   }


}

