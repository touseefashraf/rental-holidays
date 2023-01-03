import { ConstantsService } from 'src/app/services/constants.service';
import { UIHelpers } from 'src/app/helpers/ui-helpers';

import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { DataService } from './data.service'
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularEditorConfig } from '@kolkov/angular-editor'
import * as moment from 'moment'
import { ApiService } from '../../services/api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';

@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
    dataStatus = 'fetching'
    blogList = []
    thumbnail = '/assets/img/car.jpg'
    blogForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    loginLoading=false
    subjectCategoriesList: any = []
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: false,
        height: 'auto',
        minHeight: '500',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: '',
        defaultParagraphSeparator: '',
        defaultFontName: 'calibri',
        defaultFontSize: '12',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        // uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            [
                'customClasses',
                'insertVideo',
                'insertHorizontalRule',
                'removeFormat',
                // 'toggleEditorMode'
              ]
        ]
    }
    loaderOptions = {
        rows: 5,
        cols: 5,
        colSpans: {
            0: 1,
        }
    }
    moment = moment
    spinnerSVG = `/assets/images/Dring.svg`
    dateFormat: any = ''
    constructor(
        private ds: DataService,
        public cs: ConstantsService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.dateFormat = cs.DATE_TIME_FORMAT.SHORT_DATE
        this.blogForm = this.fb.group({
            id: new FormControl(null),
            date: new FormControl(null, [Validators.required]),
            title: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
            location: new FormControl(null, [Validators.maxLength(150)]),
            content: new FormControl(null, []),
            status: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.ds.get().subscribe((resp: any) => {
            if (resp.success === true) {
                this.blogList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.blogForm.controls
    }

    openModal(modal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.thumbnail = this.api.blogImageUrl(this.blogList[index].id)
            this.blogForm.controls.id.setValue(this.blogList[index].id)
            this.blogForm.patchValue(this.blogList[index])
        }else {
            this.thumbnail = '/assets/img/car.jpg'
        }
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-xl modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveSubject(data: any, f: any) {
        this.loginLoading=true
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.blogForm.value.id,
            date: moment(data.value.date).format('YYYY-MM-DD'),
            title: data.value.title,
            location: data.value.location,
            content: data.value.content,
            status: data.value.status,
        }

        fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob])
                const formData = this.api.jsonToFormData(params)
                formData.append('image', imageFile)


                let saveUpdate = this.ds.add(formData)
                if (this.blogForm.value.id !== null) {
                    saveUpdate = this.ds.update(formData)
                }
                saveUpdate.subscribe((resp: any) => {
                    if (resp.success === false) {
                        this.alert.error(resp.errors.general)
                        this.modalRef.hide()
                        f.resetForm()

                        this.loginLoading=false

                        return false
                    } else {
                        if (this.blogForm.value.id !== null) {
                            this.alert.success('Changes done successfully!!')
                            const mergeParams = {
                                id: this.blogForm.value.id,
                                date: moment(data.value.date).format('YYYY-MM-DD')+' ' + moment(data.value.start_time).format('HH:mm:ss'),
                                title: data.value.title,
                                location: data.value.location,
                                content: data.value.content,
                                status: data.value.status,
                            }
                            this.loginLoading=false
                            this.blogList[this.selectedIndex] = mergeParams
                            this.blogForm.controls.id.setValue(null)
                        } else {
                            this.alert.success('Story added successfully!!')
                            const mergeParams = {
                                id: resp.data,
                                date: moment(data.value.date).format('YYYY-MM-DD')+' ' + moment(data.value.start_time).format('HH:mm:ss'),
                                title: data.value.title,
                                location: data.value.location,
                                content: data.value.content,
                                status: data.value.status,
                            }
                            this.blogList.push(mergeParams)
                            this.loginLoading=false

                        }
                    }
                    this.modalRef.hide()
                    f.resetForm()
                })
            })
    }

    deleteSubject() {
        this.loginLoading=true
        const params = {
            id: this.selectedId
        }
        this.ds.delete(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    this.loginLoading=false
                    return false
                } else {
                    const deletingIndex = this.blogList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.blogList.splice(deletingIndex, 1)
                    this.loginLoading=false
                    this.modalRef.hide()
                    this.alert.success('Event deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelSubjectButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

    browseThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('thumbnail-image')
        element.click()
    }

    onThumbnailChange(event: any, template: TemplateRef<any>) {
        const file = event.target.files[0]
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            this.alert.error('Invalid file size. File size must not exceeds 3MB')
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
        } else {
            this.imageChangedEvent = event
            this.cropperModalRef = this.ms.show(
                template,
                Object.assign({}, { class: 'modal-md modal-dialog-centered website' })
            )
        }
    }

    doneCroppingThumbnail() {
        this.thumbnail = this.croppedImage
        document.getElementById('banner-img').setAttribute('src', this.thumbnail)
        this.cropperModalRef.hide()
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64
    }

    // companyImageCropped(event: ImageCroppedEvent) {
    //     this.croppedCompanyImage = event.base64
    // }

    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }


}
