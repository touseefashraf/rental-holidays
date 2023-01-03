import { DataService } from '../data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Component, OnInit, Input, OnDestroy, TemplateRef } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from '../../../../services/api.service'
import { IAlertService } from '../../../../libs/ialert/ialerts.service'

@Component({
    selector: 'app-add-qto-doc',
    templateUrl: './add-qto-doc.component.html',
    styleUrls: ['./add-qto-doc.component.css']
})
export class AddQtoDocComponent implements OnInit {
    @Input() modalRef: BsModalRef
    @Input() index: number
    projectId: number
    spinnerSVG: string
    data: any = []
    dataToSend = {
        project_id: -1,
        document_data: []
    }
    isLoading = false
    constructor(
        public api: ApiService,
        public dataService: DataService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private router: Router
    ) {
        this.spinnerSVG = `/assets/images/spinner.svg`
    }

    ngOnInit() {
        console.log('projectDetails', this.dataService.projectDetails)
        this.projectId = this.dataService.projectDetails.id
        this.dataToSend.project_id = this.projectId
        this.dataService.projectDetails.documents.forEach((file: any) => {
            if (file.document_type === 'qto') {
                this.dataToSend.document_data.push({
                    id: file.id,
                    qto_price: file.qto_price
                })
                this.data.push(file)
            }
        })
    }
    save() {
        this.isLoading = true
        const filePriceStatus = this.dataToSend.document_data.findIndex(d => d.qto_price < 0)
        if (filePriceStatus > -1) {
            this.alert.error('Qto file price cant be less the 0')
            this.isLoading = false

            return false
        }
        this.dataService.saveQtoData(this.dataToSend).subscribe((resp: any) => {
            this.isLoading = false
            if (resp.success == true) {
                this.alert.success('Data saved successfully')
            } else {
                this.alert.error(resp.errors.general)
            }
        })
    }
    downloadDocument(documentId: number, file: any) {
        this.dataService.downloadDocument(this.projectId, 'qto', documentId).subscribe((resp: any) => {
            const binaryData = []
            binaryData.push(resp)
            const downloadLink = document.createElement('a')
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: resp.type }))
            if (file.name) {
                downloadLink.setAttribute('download', file.name.split(".")[0])
            } else {
                downloadLink.setAttribute('download', 'document')
            }
            document.body.appendChild(downloadLink)
            downloadLink.click()
        })
    }
    cancel() {
        this.router.navigateByUrl('/agency/property/list')
    }
}
