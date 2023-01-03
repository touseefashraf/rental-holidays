import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apis } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
   private baseUrl = `${apis.baseUrl}`
   constructor(private http: HttpClient) { }

   getFaqs(): Observable<any> {
      const url = `${this.baseUrl}/public/faq-categories`

      return this.http.get<any>(url)
   }

}
