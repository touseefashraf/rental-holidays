import { ApiService } from '../../../services/api.service'
import { IAlertService } from '../../../libs/ialert/ialerts.service'
import { ConstantsService } from '../../../services/constants.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { DataService } from './data.service'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
@Component({
    selector: 'app-list-project',
    templateUrl: './list-project.component.html',
    styleUrls: ['./list-project.component.css']
})
export class ListProjectComponent implements OnInit {
    modalRef: BsModalRef
    deletingIndex = -1
    selectedId = -1
    selectedIndex = -1
    selectedStatus = ''
    deletePop: any
    page = 1
    pagination: any
    fetching = true
    projectList: any = []
    spinnerSVG = `/assets/images/spinner.svg`
    searchTitle = ''
    loaderLength = [1, 2, 3, 4, 5]
    waiting = {
        search: false,
        loading: false
    }
    loaderOptions = {
        rows: 5,
        cols: 7,
        colSpans: {
            0: 1,
        }
    }
    constructor(
        private modalService: BsModalService,
        private api: ApiService,
        public dataService: DataService,
        private route: ActivatedRoute,
        private router: Router,
        public alert: IAlertService,
        public cs: ConstantsService
    ) {
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }
            if (params.title) {
                this.searchTitle = params.title
            }
            if (params) {
                this.getProjects()
            } else {
                this.getProjects()

            }
        })

    }

    getProjects() {
        this.waiting.search = true
        const filtersParam = {
            page: this.page,
            title: this.searchTitle
        }
        this.dataService.list(filtersParam)
            .subscribe((resp: any) => {
                this.waiting.search = false
                if (resp.success === false) {
                    return false
                } else {
                    this.projectList = resp.data.data
                    console.log(this.projectList)
                    this.pagination = resp.data
                    this.fetching = false
                    this.router.navigate(['/' + this.api.user.user_type + '/project/list'], { queryParams: filtersParam, replaceUrl: true })

                }
            })
    }

    openSampleConfirmingModal(sampleProjectTemplate: TemplateRef<any>, id: number, index: number) {
        this.selectedId = id
        this.selectedIndex = index
        this.modalRef = this.modalService.show(
            sampleProjectTemplate,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    statusConfirmingModal(changeProjectStatusTemplate: TemplateRef<any>, id: number, index: number, status: string) {
        this.selectedId = id
        this.selectedIndex = index
        this.selectedStatus = status
        this.modalRef = this.modalService.show(
            changeProjectStatusTemplate,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    setPagination(page: number) {
        this.fetching = true
        let filtersParam: any = {}
        filtersParam = {
            page
        }
        this.router.navigate(['/' + this.api.user.user_type + '/project/list'], { queryParams: filtersParam, replaceUrl: true })
    }

    ngOnInit(): void {
    }

    edit(id: number) {
        this.router.navigateByUrl(`/${this.api.user.user_type}/project/publish?id=${id}`)
    }

    add() {
        this.router.navigateByUrl(`/${this.api.user.user_type}/project/publish?id=-1`)
    }

    delete() {
        this.waiting.loading = true
        const params = {
            id: this.selectedId
        }
        this.dataService.delete(params)
            .subscribe((resp: any) => {
                this.waiting.loading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)

                    return false
                } else {
                    this.projectList.splice(this.deletingIndex, 1)
                    this.alert.success('Project deleted succesfully')
                }
            })
    }

    sampleProject() {
        this.waiting.loading = true
        const params = {
            id: this.selectedId
        }
        this.dataService.sampleProject(params)
            .subscribe((resp: any) => {
                this.waiting.loading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)

                    return false
                } else {
                    const oldSampleProjectIndex = this.projectList.findIndex(d => d.sample_project == 1)
                    if (oldSampleProjectIndex > -1) {
                        this.projectList[oldSampleProjectIndex].sample_project = 0
                    }
                    this.projectList[this.selectedIndex].sample_project = 1
                    this.modalRef.hide()
                    this.alert.success('Project marked as sample successfully')
                }
            })
    }

    changeProjectStatus() {
        this.waiting.loading = true
        const params = {
            id: this.selectedId,
            status: this.selectedStatus
        }
        this.dataService.changeProjectStatus(params)
            .subscribe((resp: any) => {
                this.waiting.loading = false
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)

                    return false
                } else {
                    this.projectList[this.selectedIndex].status = this.selectedStatus
                    this.alert.success(`Project status change to ${this.selectedStatus}`)
                    this.modalRef.hide()
                }
            })
    }
}
