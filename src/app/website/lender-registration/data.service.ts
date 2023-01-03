import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { identity, Observable } from 'rxjs';
import { apis } from 'src/environments/environment';

@Injectable()
export class DataService {
    user_id //from modal of step 1, endpint: register-lender
    vehicle_type_id //from step 1
    vehicle_id //from step 2 and 3, endpoint: save-lender-vehicle

    data = {
        personalInfo: {
            email: '',
            password: ''
        },
        vehicle_details: {
            user_id: '',
            vehicle_id: -1,
            vehicle_type_id: -1,
            make: '',
            model: '',
            allowed_weight: '',
            no_beds: '',
            location: '',
            lat: null,
            lng: null,

            price_per_night: 1,
            min_booking_period: 1,
        }

    }
    private baseUrl = `${apis.baseUrl}`
    constructor(
        public http: HttpClient
    ) { }
    vehicle_list(): Observable<any> {
        const url = `${apis.baseUrl}/public/vehicle-types`

        return this.http.get<any>(url)
    }
    addLender(params): Observable<any> {
        const url = `${this.baseUrl}/landlord/register`

        return this.http.post<any>(url, params)
    }


    getVehicalImages(params: any): Observable<any> {
        const url = `${this.baseUrl}/landlord/vehicle-image-list`
        return this.http.post<any>(url, params)
    }

    uploadImage(formData: FormData) {
        const url = `${this.baseUrl}/landlord/add-vehicle-image`

        return this.http.post<any>(url, formData)
    }
    deleteImage(params: any): Observable<any> {
        const url = `${this.baseUrl}/landlord/delete-vehicle-image`

        return this.http.post(url, params)
    }
    saveCamperDetails(params): Observable<any> {
        const url = `${this.baseUrl}/landlord/reg-update-vehicle`

        return this.http.post<any>(url, params)
    }
    ImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/vehicle-types-image/${id}`
    }

    vehicleDetails(id): Observable<any> {
        const url = `${apis.baseUrl}/public/vehicle-details/${id}`

        return this.http.get<any>(url)
    }

}
