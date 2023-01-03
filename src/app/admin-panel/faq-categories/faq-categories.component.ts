import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from './../../libs/ialert/ialerts.service'

@Component({
   selector: 'app-faq-categories',
   templateUrl: './faq-categories.component.html',
   styleUrls: ['./faq-categories.component.css']
})
export class FaqCategoriesComponent implements OnInit {
   dataStatus = 'fetching'
   faqCategoriesData = []
   faqCatList = []
   faqCatForm: FormGroup
   modalRef: BsModalRef
   selectedIndex: any
   selectedId: any
   loginLoading=false
   loaderOptions = {
    rows: 5,
    cols: 5,
    colSpans: {
        0: 1,
    }
}
   constructor(
      public data: DataService,
      private fb: FormBuilder,
      private ms: BsModalService,
      public ui: UIHelpers,
      public alert: IAlertService,
   ) {
      this.faqCatForm = this.fb.group({
         id: new FormControl(null),
         name_en: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
         name_de: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
         name_nl: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
         name_fr: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
         description_en: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
         description_de: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
         description_nl: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
         description_fr: new FormControl(null, [Validators.required, Validators.maxLength(500)])
      })
   }

   ngOnInit() {
      this.data.getFaqCategories().subscribe(
         (resp: any) => {
            if (resp.success === true) {
               this.faqCategoriesData = resp.data
               this.dataStatus = 'done'
            }
         }
      )
   }

   get g() {
      return this.faqCatForm.controls
   }

   openModalFAQCat(faqCatModal, index) {
      this.selectedIndex = index
      if (index > -1) {
         this.faqCatForm.patchValue(this.faqCategoriesData[index])
      }
      this.modalRef = this.ms.show(
         faqCatModal,
         {
            class: 'modal-lg modal-dialog-centered admin-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
         }
      )
   }

   saveFAQCat(data: any, f: any) {
    this.loginLoading=true
      this.faqCatForm.value
      if (data.status === 'INVALID') {
         this.alert.error('Please Fill valid data in all fields and try again.')
         this.loginLoading=false
         return false
      }
      let saveMethod = this.data.addFaqCategories(data.value)

      if (this.faqCatForm.value.id !== null) {
         saveMethod = this.data.updateFaqCategories(data.value)
      }

      saveMethod.subscribe((resp: any) => {
         if (resp.success === true) {
            if (this.faqCatForm.value.id !== null) {
               this.alert.success('Your FAQ Category Updated successfully')
               this.faqCategoriesData[this.selectedIndex] = data.value
               this.loginLoading=false
            } else {
               data.value.id = resp.data
               this.alert.success('Your FAQ Category saved successfully')
               this.faqCategoriesData.push(data.value)
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

   deleteFAQCat() {
      const params = {
         id: this.faqCategoriesData[this.selectedIndex].id
      }
      this.data.deleteFaqCategories(params)
         .subscribe((resp: any) => {
            if (resp.success === false) {
               this.alert.error(resp.errors.general)

               return false
            }

            this.faqCategoriesData.splice(this.selectedIndex, 1)
            this.alert.success('FAQ Category deleted successfully!!')

            this.modalRef.hide()
         })
   }

   confirmingModal(template: TemplateRef<any>, id: any, i: any) {
      this.selectedId = id
      this.selectedIndex = i
      this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
   }

   cancelFAQCatButton(f: any) {
      f.resetForm()
      this.modalRef.hide()
   }
}
