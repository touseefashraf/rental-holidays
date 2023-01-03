import { ActivatedRoute } from '@angular/router'
import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from './../../libs/ialert/ialerts.service'

@Component({
    selector: 'app-faq-questions',
    templateUrl: './faq-questions.component.html',
    styleUrls: ['./faq-questions.component.css']
})
export class FaqQuestionsComponent implements OnInit {
    dataStatus = 'fetching'
    faqData = []
    faqId = ''
    faqForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: any
    selectedId: any
    loginLoading=false
    loaderOptions = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1,
        }
    }
    constructor(
        private route: ActivatedRoute,
        public data: DataService,
        private fb: FormBuilder,
        private ms: BsModalService,
        public ui: UIHelpers,
        public alert: IAlertService,
    ) {
        this.faqId = this.route.snapshot.paramMap.get('id')
        console.log(this.faqId)

        this.faqForm = this.fb.group({
            id: new FormControl(null),
            question_en: new FormControl(null, [Validators.required]),
            question_de: new FormControl(null, [Validators.required]),
            question_nl: new FormControl(null, [Validators.required]),
            question_fr: new FormControl(null, [Validators.required]),
            answer_en: new FormControl(null, [Validators.required]),
            answer_de: new FormControl(null, [Validators.required]),
            answer_nl: new FormControl(null, [Validators.required]),
            answer_fr: new FormControl(null, [Validators.required])
        })
    }

    ngOnInit() {
        const params = {
            cat_id: this.faqId
        }
        this.data.getFaq(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.faqData = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.faqForm.controls
    }

    openModalFAQ(faqModal, index) {
        this.selectedIndex = index
        if (index > -1) {
            this.faqForm.patchValue(this.faqData[index])
        }
        this.modalRef = this.ms.show(
            faqModal,
            {
                class: 'modal-lg modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveFAQ(data: any, f: any) {
        this.loginLoading=true
        if (data.status === 'INVALID') {
            this.alert.error('Please Fill valid data in all fields and try again.')
            this.loginLoading=false
            return false
        }

        data.value.faq_category_id = this.faqId

        let saveMethod = this.data.addFaq(data.value)

        if (this.faqForm.value.id !== null) {
            saveMethod = this.data.updateFaq(data.value)
        }

        saveMethod.subscribe((resp: any) => {
            if (resp.success === true) {
                if (this.faqForm.value.id !== null) {
                    this.alert.success('Your FAQ Updated successfully')
                    this.faqData[this.selectedIndex] = data.value
                    this.loginLoading=false
                } else {
                    data.value.id = resp.data
                    this.alert.success('Your FAQ saved successfully')
                    this.faqData.push(data.value)
                    this.loginLoading=false
                }
            } else {
                this.alert.error(resp.errors.general)
                this.loginLoading=false
            }

            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteFAQ() {
        this.loginLoading=true
        const params = {
            id: this.selectedId
        }
        this.data.deleteFaq(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.loginLoading=false
                    return false
                } else {
                    const deletingIndex = this.faqData.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.faqData.splice(deletingIndex, 1)
                    this.alert.success('FAQ deleted successfully!!')
                    this.loginLoading=false
                }
                this.modalRef.hide()
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelFAQButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

}
