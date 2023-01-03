import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router'
import { IAlertService } from '../../libs/ialert/ialerts.service'
import { UIHelpers } from '../../helpers/ui-helpers'
import { DataService } from './data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, ViewChild } from '@angular/core'
import { AutocompleteComponent } from 'angular-ng-autocomplete'
import * as moment from 'moment'

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

    @ViewChild('autocomplete') autocomplete: AutocompleteComponent
    dataStatus = 'fetching'
    listTransactionData: any = []
    selectedIndex = -1
    keyword = 'name'
    moment = moment
    selectedUser: any = []
    userData = []
    searchForm: FormGroup
    modalRef: BsModalRef
    loginLoading = false
    pagination: any = []
    page = 1
    userId: any = ''
    loaderOptions = {
        rows: 3,
        cols: 7,
        colSpans: {
            0: 1,
        }
    }

    constructor(
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public ms: BsModalService,
        public route: ActivatedRoute,
        private router: Router,

    ) {

        // Search form
        this.searchForm = this.fb.group({
            user_id: new FormControl(null),
            dateRange: new FormControl(null)
        })
    }
    search(f: any) {
        this.getTransactionHistory()
    }
    reset(f: any) {

        this.userId = ''
        let params = { user_id: '', dateRange: null }
        this.searchForm.patchValue(params)
        this.getTransactionHistory()
    }

    onChangeSearch(keyword: string) {
        this.ds.searchUsers(keyword)
            .subscribe((resp: any) => {
                let r = []
                resp.data.forEach((user: any) => {
                    user.name = `${user.first_name} ${user.last_name}`
                    r.push(user)
                });
                this.userData = r
            }, (error) => {
                console.log('Error occuared', error);

            })
    }
    selectEvent(event) {
        console.log(event)
        this.userId = event.id
    }


    getTransactionHistory() {

        let params = { user_id: this.userId, from_date: '', to_date: '' }

        if (this.searchForm.value.dateRange != null) {
            params.from_date = moment(this.searchForm.value.dateRange[0]).format('YYYY-MM-DD')
            params.to_date = moment(this.searchForm.value.dateRange[1]).format('YYYY-MM-DD')
        }
        const listtransaction = this.ds.listTransaction(params)
        listtransaction.subscribe((resp: any) => {
            if (resp.success === true) {
                this.listTransactionData = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/transaction-history'], { queryParams: {}, replaceUrl: true })
            }
        })
    }

    get g() {
        return this.searchForm.controls
    }

    setPagination(page: number) {
        let filtersParam: any = {}
        filtersParam = { page }
        this.router.navigate(['/admin/transaction-history'], { queryParams: filtersParam, replaceUrl: true })
    }

    openModal(modal, index) {

        this.selectedIndex = index
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }


    cancelButton(f: any) {
        if (f) {
            f.resetForm()
        }
        this.modalRef.hide()
    }
    ngOnInit() {
        this.getTransactionHistory()
    }
}
