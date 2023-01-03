import { DataService } from '../data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Component, OnInit, Input, OnDestroy, TemplateRef, ElementRef, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from '../../../../services/api.service'
import { IAlertService } from '../../../../libs/ialert/ialerts.service';

@Component({
    selector: 'app-add-addendum-doc',
    templateUrl: './add-addendum-doc.component.html',
    styleUrls: ['./add-addendum-doc.component.css']
})
export class AddAddendumDocComponent implements OnInit {
    @ViewChild('inputField', { static: false }) inputFieldRef: ElementRef<any>
    @Input() modalRef: BsModalRef
    @Input() index: number
    uploadedFiles = []
    projectId: number
    spinnerSVG: string
    mRef: BsModalRef
    deletionIds: any = []
    sub: any

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
        this.dataService.projectDetails.documents.forEach((file: any) => {
            if (file.document_type === 'addendum') {
                this.uploadedFiles.push({
                    id: file.id,
                    name: file.name,
                    mark: file.mark_as_new
                })
            }
        })
    }
    openConfirmingModal(modal: TemplateRef<any>) {
        this.mRef = this.modalService.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    openSelectedConfirmingModal(modal: TemplateRef<any>) {
        this.mRef = this.modalService.show(
            modal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    onDocumentChange(event: any) {
        this.uploadFiles(event.target.files)
    }

    uploadFiles(files: FileList) {
        const allowedExtensions = ['pdf']
        const defaulterFiles = []

        Array.from(files).forEach((file: any) => {
            const extension = file.name.split('.').pop().toLowerCase()
            if (this.checkFileExist(file)) {
                return false
            }
            if (allowedExtensions.indexOf(extension) > -1) {
                this.readFile(file)
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} has an invalid file type. Only pdf are allowed`)
            }
        })
    }
    checkFileExist(file) {
        let fileExist: boolean
        this.uploadedFiles.forEach(d => {
            if (file.name.split('.')[0] == d.name) {
                fileExist = true
            }
        })
        if (fileExist) {
            this.alert.error(`${file.name} is already added `)
            this.inputFieldRef.nativeElement.value = ''

            return true
        } else {
            return false
        }
    }
    readFile(file: any) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {
            const index = this.uploadedFiles.length
            this.uploadedFiles.push({
                id: -1,
                file: reader.result,
                uploading: true
            })
            this.uploadDocument(reader.result, index, file)
        }
    }

    addMarkNew(id: number, index, event) {
        const file = this.uploadedFiles[index]
        const markAs = event.srcElement.checked == true ? 1 : 0

        const params = { fileId: id, mark_as_new: markAs }

        this.dataService.ChangeFileState(params).subscribe((resp: any) => {
            if (resp.success == true) {
                this.uploadedFiles[index].mark = markAs
                const ind = this.dataService.projectDetails.documents.findIndex((d) => d.id == id)
                this.dataService.projectDetails.documents[ind].mark_as_new = markAs
                this.alert.success(resp.msg)
            }
            else {
                this.alert.error(resp.msg)
            }
        })
    }

    checkState(id, index) {

        return this.uploadedFiles[index].mark == 1 ? true : false

    }


    uploadDocument(fileData: any, index: number, file: any) {
        fetch(fileData)
            .then(res => res.blob())
            .then(blob => {
                const myFile = new Blob([blob]) // for microsoft edge support
                const formData = new FormData()
                formData.append('document_type', 'addendum')
                formData.append('document', myFile)
                formData.append('name', file.name.split(".")[0])
                formData.append('project_id', this.dataService.projectDetails.id.toString())
                this.dataService.uploadFile(formData).subscribe((resp: any) => {
                    if (resp.success == true) {
                        this.uploadedFiles[index].id = resp.data
                        this.uploadedFiles[index].uploading = false
                        this.uploadedFiles[index].name = file.name.split(".")[0]
                        this.dataService.projectDetails.documents.push({
                            id: resp.data,
                            project_id: this.dataService.projectDetails.id,
                            name: file.name.split(".")[0],
                            document_type: 'addendum'
                        })
                        this.alert.success(`${file.name.split(".")[0]} uploaded successfully`)
                    } else {
                        this.alert.error(resp.errors.general)
                        this.uploadedFiles[index].uploading = false
                    }
                    this.inputFieldRef.nativeElement.value = ''
                })//upload api
            })
    }

    deleteFile(index: number) {

        let delId = this.uploadedFiles[index].id
        this.uploadedFiles.splice(index, 1)
        this.uploadedFiles.splice(index, 0, {
            deletion: true
        })
        const params = {
            id: delId,
            project_id: this.projectId,
            file_type: 'addendum'
        }
        const fileype = this.uploadedFiles[index].id
        this.dataService.deleteFile(params).subscribe(resp => {
            if (resp.success == true) {
                this.uploadedFiles.splice(index, 1)
                const i = this.dataService.projectDetails.documents.findIndex((img: any) => img.id === params.id)
                this.dataService.projectDetails.documents.splice(i, 1)
            } else {
                this.alert.error(resp.errors.general)
                delete this.uploadedFiles[index].image
            }
        })
    }

    deleteAllFiles() {
        const params = {
            project_id: this.projectId,
            file_type: 'addendum'
        }
        this.dataService.deleteAllFiles(params).subscribe(resp => {
            if (resp.success == true) {
                this.uploadedFiles = []
                this.dataService.projectDetails.documents = []
                this.alert.success('All files Deleted successfully')
            } else {
                this.alert.error(resp.errors.general)
            }
            this.mRef.hide()
        })
    }

    addDeletionIds(id: number) {
        const index = this.deletionIds.findIndex(d => d == id)
        if (index > -1) {
            this.deletionIds.splice(index, 1)
        } else {
            this.deletionIds.push(id)
        }
    }

    deleteSelectedFiles() {
        const params = {
            fileIds: this.deletionIds,
            file_type: 'addendum',
            project_id: this.projectId
        }
        this.dataService.deleteSelectedFiles(params).subscribe(resp => {
            if (resp.success == true) {
                this.deletionIds.forEach((data: any) => {
                    const index = this.uploadedFiles.findIndex(d => d.id == data)
                    if (index > -1) {
                        this.uploadedFiles.splice(index, 1)
                        this.dataService.projectDetails.documents.splice(index, 1)
                    }
                })
                this.deletionIds = []
                this.alert.success('Selected files Deleted successfully')
            } else {
                this.alert.error(resp.errors.general)
            }
            this.mRef.hide()
        })
    }

    downloadDocument(documentId: number, file: any) {
        this.dataService.downloadDocument(this.projectId, 'addendum', documentId).subscribe((resp: any) => {
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


    fileDragStart(e: any): void {
        e.preventDefault()
        e.target.classList.add('highlight')
    }

    fileDragEnd(e: any): void {
        e.preventDefault()
        e.target.classList.remove('highlight')
    }

    fileDropped(e: any): void {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer && e.dataTransfer.files.length) {
            this.uploadFiles(e.dataTransfer.files)
        }
        e.target.classList.remove('highlight')
    }

    browseFiles(event: any) {
        event.preventDefault()
        const element = document.getElementById('other-files')
        element.click()
    }
    cancel() {
        this.router.navigateByUrl('/agency/property/list')
    }
}
