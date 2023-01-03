import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/${this.api.user.user_type}`
    qtoListDetails: Array<any> = []
    projectOwnerList: Array<any> = []
    csiDivisionList: Array<any> = []
    planHoldersList: any = []
    customerList: any = []
    projectDetails: any
    planholdersDataToSend: any = []
    public needsRefresh = true
    step: any = 'details'
    step1Data: any = null
    planholderFetching = true
    selectedId: any = -1
    bidPhase = 'open'
    constructor(public http: HttpClient, private api: ApiService, private router: Router) {
    }

    navigateWindow(obj: any) {
        this.router.navigate(['/'+this.api.user.user_type+'/project/publish'], { queryParams: obj, replaceUrl: true })
    }

    savePlanHolders(params: any): Observable<any> {
        const url = `${this.baseUrl}/save-project-plan-holders`

        return this.http.post<any>(url, params)
    }

    save(params: any): Observable<any> {
        const url = `${this.baseUrl}/save-project`

        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-project`

        return this.http.post<any>(url, params)
    }

    delete(params: number): Observable<any> {
        const url = `${this.baseUrl}/delete-project`

        return this.http.post<any>(url, params)
    }

    qtoList(): Observable<any> {
        const url = `${this.baseUrl}/qto-list`

        return this.http.get<any>(url)
    }

    deleteFile(params: any) {
        const url = `${this.baseUrl}/delete-project-file`

        return this.http.post<any>(url, params)
    }

    ChangeFileState(params: any) {
        const url = `${this.baseUrl}/file-mark-as-new`

        return this.http.post<any>(url, params)
    }

    deleteAllFiles(params: any) {
        const url = `${this.baseUrl}/delete-selected-document-folder`

        return this.http.post<any>(url, params)
    }

    deleteSelectedFiles(params: any) {
        const url = `${this.baseUrl}/delete-selected-file`

        return this.http.post<any>(url, params)
    }

    saveQtoData(params: any) {
        const url = `${this.baseUrl}/save-qto-price`

        return this.http.post<any>(url, params)
    }

    downloadDocument(projectId: number, docType: any, documentId: number) {
        const url = `${this.baseUrl}/project-document/${projectId}/${docType}/${documentId}`

        return this.http.get<any>(url, { responseType: 'blob' as 'json' })
    }

    getProjectOwnerList(): Observable<any> {
        const url = `${this.baseUrl}/project-owners`

        return this.http.get<any>(url)
    }

    getCsiDivisionList(): Observable<any> {
        const url = `${this.baseUrl}/csi-division-list`

        return this.http.get<any>(url)
    }

    getCustomerList(): Observable<any> {
        const url = `${this.baseUrl}/customers`

        return this.http.get<any>(url)
    }

    getProjectDetails(paramId: any): Observable<any> {
        const url = `${this.baseUrl}/project-detail`
        const params = {
            id: paramId
        }

        return this.http.get<any>(url, { params })
    }

    uploadFile(formData: FormData) {
        const url = `${this.baseUrl}/save-project-file`

        return this.http.post<any>(url, formData)
    }

    projectPlanHolders(params: any) {
        const url = `${this.baseUrl}/project-plan-holders`

        return this.http.get<any>(url, { params })
    }


    loadLovs() {
        this.qtoList().subscribe((resp: any) => {
            this.qtoListDetails = resp.data
        })

        this.getProjectOwnerList().subscribe((resp: any) => {
            this.projectOwnerList = resp.data
        })

        this.getProjectOwnerList().subscribe((resp: any) => {
            this.projectOwnerList = resp.data
        })

        this.getCsiDivisionList().subscribe((resp: any) => {
            this.csiDivisionList = resp.data
        })

        // this.api.getPlanholdersList().subscribe((resp: any) => {
        //     this.planHoldersList = resp.data
        //     this.planholderFetching = false
        // })

        this.getCustomerList().subscribe((resp: any) => {
            this.customerList = resp.data
        })

    }
}
