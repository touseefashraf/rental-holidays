import { Router } from '@angular/router'
import { ConstantsService } from './constants.service'
import { map } from 'rxjs/operators'
import { apis } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    totalItems = new BehaviorSubject<any>(true)
    cartItmes = new BehaviorSubject<number>(0)
    public headerType = 'black'
    blackUrlends = ['/', 'lender-estimate']
    public activeTab = ''
    public homeBannerPrice = ''
    searchKeyword = ''
    showLoading = new Subject<boolean>()
    baseUrl: string
    searchFilter: any
    userLoggedInSource = new BehaviorSubject(false)
    scrollBottom: boolean
    scrollBottomChange = new Subject<boolean>()
    userImage = new Subject<string>()
    userLoggedInObs = this.userLoggedInSource.asObservable()
    cartData: any = null
    user: any = {
        id: 0,
        user_name: '',
        email: '',
        user_type: '',
        api_token: '',
        balance: 0,
        status: ''
    }
    constructor(
        public http: HttpClient,
        public cs: ConstantsService,
        private ts: TranslateService,
    ) {
        this.baseUrl = apis.baseUrl + '/public'
        this.scrollBottom = false
        this.scrollBottomChange.subscribe((value) => {
            this.scrollBottom = value
        })
        if (localStorage.getItem('token')) {
            this.user = JSON.parse(localStorage.getItem('user'))
            this.userLoggedInSource.next(true)
        } else {
            this.userLoggedInSource.next(false)
        }

        if (localStorage.getItem('cart')) {
            this.cartData = JSON.parse(localStorage.getItem('cart'))
            console.log('new value 1', this.cartData.documents.length)
            this.cartItmes.next(this.cartData.documents.length)
        }
    }

    toggleScrollBottom(value: boolean): void {
        this.scrollBottomChange.next(value)
    }

    login(params: any): Observable<any> {
        const url = `${this.baseUrl}/login`

        return this.http.post<any>(url, params)
            .pipe(
                map(resp => {
                    if (resp && resp.success && resp.data.token) {
                        localStorage.setItem('token', resp.data.token)
                        localStorage.setItem('user', JSON.stringify(resp.data))
                        this.user = resp.data
                        console.log(this.user)
                        this.userLoggedInSource.next(true)
                    }

                    return resp
                })
            )
    }

    googleLogin(): Observable<any> {
        const url = `${this.baseUrl}/login/${'google'}`

        return this.http.get<any>(url)
            .pipe(
                map(resp => {
                    if (resp && resp.success && resp.data.token) {
                        localStorage.setItem('token', resp.data.token)
                        localStorage.setItem('user', JSON.stringify(resp.data))
                        this.user = resp.data
                        console.log(this.user)
                        this.userLoggedInSource.next(true)
                    }

                    return resp
                })
            )
    }

    register(params: any): Observable<any> {
        const url = `${this.baseUrl}/register`

        return this.http.post<any>(url, params)
            .pipe(
                map(resp => {
                    if (resp && resp.success && resp.data.token) {
                        localStorage.setItem('token', resp.data.token)
                        localStorage.setItem('user', JSON.stringify(resp.data))
                        this.user = resp.data
                        this.userLoggedInSource.next(true)
                    }

                    return resp
                })
            )
    }

    doUserRedirects(resp: any, router: Router) {
        switch (resp.data.user_type) {
            case 'tenant': {
                router.navigate(['/tenant/profile'])
                break
            }
            case 'landlord': {
                router.navigate(['/lender/profile'])
                break
            }
            case 'admin': {
                router.navigate(['/admin/dashboard'])
                break
            }
        }
    }

    logOut(): boolean {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.user.id = 0
        this.userLoggedInSource.next(false)

        return true
    }

    isAuthenticated(): boolean {
        if (localStorage.getItem('token')) {
            return true
        } else {
            return false
        }
    }

    isTenant(): boolean {
        if (this.isAuthenticated() && this.user.user_type === ConstantsService.USER_ROLES.TENANT) {
            return true
        } else {
            return false
        }
    }

    isAdmin(): boolean {
        if (this.isAuthenticated() && this.user.user_type === ConstantsService.USER_ROLES.ADMIN) {
            return true
        } else {
            return false
        }
    }
    isLandLord(): boolean {
        if (this.isAuthenticated() && this.user.user_type === ConstantsService.USER_ROLES.LANDLORD) {
            return true
        } else {
            return false
        }
    }

    translate(key: string) {
        return this.ts.get(key)
    }

    getCurrentLang() {
        let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.ts.getBrowserLang()
        if (!lang) {
            lang = 'en'
        }

        return lang
    }
    changeLanguage(lang: string) {
        this.ts.currentLang = lang
        console.log('Language Changed to', lang)
        localStorage.setItem('lang', lang)
        this.ts.setDefaultLang(lang)
        this.ts.use(lang)
        location.reload()
    }
    // public Api call
    saveContactUs(postData): Observable<any> {
        const url = `${this.baseUrl}/contact-us`

        return this.http.post<any>(url, postData)
    }

    jsonToFormData(jsonObject: object, parentKey?: any, carryFormData?: FormData): FormData {

        const formData = carryFormData || new FormData()
        let index = 0

        // tslint:disable-next-line: forin
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
                    let propName = parentKey || key
                    if (parentKey && this.isObject(jsonObject)) {
                        propName = parentKey + '[' + key + ']'
                    }
                    if (parentKey && this.isArray(jsonObject)) {
                        propName = parentKey + '[' + index + ']'
                    }
                    if (jsonObject[key] instanceof File) {
                        formData.append(propName, jsonObject[key])
                    } else if (jsonObject[key] instanceof FileList) {
                        for (let j = 0; j < jsonObject[key].length; j++) {
                            formData.append(propName + '[' + j + ']', jsonObject[key].item(j))
                        }
                    } else if (this.isArray(jsonObject[key]) || this.isObject(jsonObject[key])) {
                        this.jsonToFormData(jsonObject[key], propName, formData)
                    } else if (typeof jsonObject[key] === 'boolean') {
                        formData.append(propName, +jsonObject[key] ? '1' : '0')
                    } else {
                        formData.append(propName, jsonObject[key])
                    }
                }
            }
            index++
        }

        return formData
    }
    isArray(val: any) {
        const toString = ({}).toString

        return toString.call(val) === '[object Array]'
    }

    isObject(val: any) {
        return !this.isArray(val) && typeof val === 'object' && !!val
    }

    searchableLocations(keyword: string, noLoader?: boolean): Observable<any> {
        const loader = noLoader === true ? '?no-loader=true' : ''
        const url = `${apis.baseUrl}/public/searchable-locations/${keyword}${loader}`

        return this.http.get<any>(url)
    }

    logOutSession(): Observable<any> {
        const url = `${this.baseUrl}/logout`

        return this.http.post<any>(url, {})
    }

    checkVerificationCode(data): Observable<any> {
        const url = `${this.baseUrl}/verify-email`

        return this.http.post<any>(url, data)
    }

    resendVerificationCode(data): Observable<any> {
        const url = `${this.baseUrl}/resend-code`

        return this.http.post<any>(url, data)
    }

    // Profile update

    companyImageUrl(Id?: number) {
        Id = Id ? Id : -1

        return `${apis.baseUrl}/public/company-image/${Id}`
    }
    userImageUrl(userId?: number) {
        userId = userId ? userId : -1

        return `${apis.baseUrl}/public/profile-image/${userId}`
    }
    checkResetCode(data): Observable<any> {
        const url = `${this.baseUrl}/verify-code`

        return this.http.post<any>(url, data)
    }

    resetPass(data): Observable<any> {
        const url = `${this.baseUrl}/reset-password`

        return this.http.post<any>(url, data)
    }

    getPlanholdersList(): Observable<any> {
        const url = `${this.baseUrl}/plan-holders-list`

        return this.http.get<any>(url)
    }

    getIndexPageCounters(): Observable<any> {
        const url = `${this.baseUrl}/home-page-counters`

        return this.http.get<any>(url)
    }

    getPageContent(params): Observable<any> {
        const url = `${this.baseUrl}/page-content`

        return this.http.get<any>(url, { params })
    }

    blogImageUrl(id?: number) {
        id = id ? id : -1

        return `${apis.baseUrl}/public/blog-image/${id}`
    }

    vehicleImageUrl(id?: number) {
        id = id ? id : -1
        return `${apis.baseUrl}/public/vehicle-image/${id}`
    }

    vehicleThumbnailUrl(id?: number) {
        id = id ? id : -1
        return `${apis.baseUrl}/public/vehicle-main-image/${id}`
    }
}
