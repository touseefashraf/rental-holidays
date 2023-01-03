import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { IAlertService } from './../../../../libs/ialert/ialerts.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from './../../../../services/api.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { DataService } from '../data.service'
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-planholders',
    templateUrl: './add-planholders.component.html',
    styleUrls: ['./add-planholders.component.css']
})
export class AddPlanholdersComponent implements OnInit {
    modalRef: BsModalRef
    deletePop: any
    multiplePlanholdersToAddInForm: any = []
    // dataService.planholdersDataToSend: Array<any> = []
    selectedIndex = -1
    checkValue = true
    isAwarded: any = false
    searchText = ''
    apiData = {
        project_id: this.dataService.selectedId,
        bid_phase: this.dataService.bidPhase,
        plan_holder_data: [],
        awarded: 0
    }
    isLoading = false
    constructor(
        public api: ApiService,
        public dataService: DataService,
        public ms: BsModalService,
        public alert: IAlertService,
        private router: Router,
        public pipe: FilterPipe
    ) { }

    ngOnInit() {
        // plan holders work
        this.dataService.projectPlanHolders({ project_id: this.dataService.projectDetails.id }).subscribe((resp: any) => {
            this.dataService.planHoldersList = resp.data
            console.log('responseeee', this.dataService.planHoldersList)
            resp.data.project_plan_holders.forEach(d => {
                const dataToPush = {
                    id: +d.plan_holder_id,
                    price: d.price
                }
                this.dataService.planholdersDataToSend.push(dataToPush)
                if (d.awarded == 1) {
                    this.isAwarded = true
                    this.apiData.awarded = d.plan_holder_id
                }
            })
            this.dataService.planholderFetching = false
        })
        // plan holders work end
        // this.dataService.projectDetails.project_plan_holders.forEach(d => {
        //     if (d.awarded == 1) {
        //         this.isAwarded = true
        //         this.apiData.awarded = d.plan_holder_id
        //     }
        // })
    }
    getPlanHoldersData(id) {
        this.dataService.projectPlanHolders({ project_id: id }).subscribe((resp: any) => {
            this.dataService.planHoldersList = resp.data
            this.dataService.planholderFetching = false
        })
    }

    openPlanHoldersModal(planholdersTemplate: TemplateRef<any>) {
        this.modalRef = this.ms.show(
            planholdersTemplate,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    spliceAddPlanholdersIds(data: any) {
        const index = this.multiplePlanholdersToAddInForm.findIndex(obj => obj.id == data.id)
        if (index > -1) {
            this.multiplePlanholdersToAddInForm.splice(index, 1)
        } else {
            this.multiplePlanholdersToAddInForm.push(data)
        }
        console.log('ids', this.multiplePlanholdersToAddInForm)

    }

    addSelectedMultipleIdsInForm() {
        this.multiplePlanholdersToAddInForm.forEach(d => {
            this.dataService.planholdersDataToSend.push({
                id: d.id,
                price: 0
            }) //1
            this.dataService.planHoldersList.project_plan_holders.push({
                plan_holder_id: d.id,
                awarded: 0,
                price: 0,
                plan_holder: d
            })//2
            const index = this.dataService.planHoldersList.plan_holders.findIndex(ph => ph.id == d.id)
            if (index > -1) {
                this.dataService.planHoldersList.plan_holders.splice(index, 1)
            }
        })
        this.multiplePlanholdersToAddInForm = []
    }
    awardProject(data: any, index: number) {
        this.dataService.planHoldersList.project_plan_holders.forEach(d => {
            if (d.plan_holder_id == data.plan_holder_id) {
                d.awarded = 1
                this.apiData.awarded = d.plan_holder_id

            } else {
                d.awarded = 0
            }
        })
        this.isAwarded = true
    }
    addMorePlanHolders(data) {
        const i = this.dataService.planHoldersList.plan_holders.findIndex(d => d.id == data.id)
        this.dataService.planholdersDataToSend.push({
            id: this.dataService.planHoldersList.plan_holders[i].id,
            price: 0
        })
        this.dataService.planHoldersList.project_plan_holders.push({
            plan_holder_id: this.dataService.planHoldersList.plan_holders[i].id,
            awarded: 0,
            price: 0,
            plan_holder: this.dataService.planHoldersList.plan_holders[i]
        })
        this.dataService.planHoldersList.plan_holders.splice(i, 1)
    }

    removeRow() {
        if (this.dataService.planHoldersList.project_plan_holders[this.selectedIndex].awarded == 1) {
            this.isAwarded = false
        }
        this.dataService.planholdersDataToSend.splice(this.selectedIndex, 1)
        this.dataService.planHoldersList.plan_holders.push(this.dataService.planHoldersList.project_plan_holders[this.selectedIndex].plan_holder)
        this.dataService.planHoldersList.project_plan_holders.splice(this.selectedIndex, 1)
    }

    saveData() {
        this.isLoading = true
        if (this.dataService.bidPhase !== 'open' && this.dataService.planholdersDataToSend.length == 0) {
            this.isLoading = false
            this.alert.error('Please Select Atleast one planholder')

            return false
        }
        this.dataService.planholdersDataToSend.forEach(d => {
            if (this.dataService.bidPhase !== 'open' && (d.price == null))
                this.checkValue = false

            return false
        })
        if (this.dataService.bidPhase !== 'open' && this.checkValue == false) {
            this.alert.error('Price cant be empty')
            this.checkValue = true
            this.isLoading = false

            return false
        }
        if (this.dataService.bidPhase == 'awarded' && !this.isAwarded) {
            this.alert.error('Your bid phase is awarded. Awarded plan holder is required')
            this.isLoading = false

            return false
        }
        this.apiData.bid_phase = this.dataService.bidPhase
        this.apiData.plan_holder_data = this.dataService.planholdersDataToSend
        if (this.dataService.bidPhase !== 'awarded') {
            delete this.apiData.awarded
        }
        this.dataService.savePlanHolders(this.apiData).subscribe((resp: any) => {
            this.isLoading = false
            if (resp.success == true) {
                this.alert.success('Plan holders Saved successfully')
                const navigateObj = {
                    id: this.dataService.selectedId,
                    step: 'spec'
                }
                this.dataService.navigateWindow(navigateObj)
                this.dataService.planholdersDataToSend = []
            } else {
                this.alert.error(resp.errors.general)
            }
        })
    }
}
