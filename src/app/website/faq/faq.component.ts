import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'

@Component({
   selector: 'app-faq',
   templateUrl: './faq.component.html',
   styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
   lang: any
   questions = []
   faqData = []
   constructor(public api: ApiService, public data: DataService) {
      this.lang = this.api.translate('website.FAQ')
   }

   ngOnInit() {
      this.data.getFaqs().subscribe((resp: any) => {
         if (resp.success == true) {
            this.faqData = resp.data
         }
      })

   }

   expandAll(i: number) {
      this.faqData[i].faq.forEach((v: any) => v.collapse = 0)
   }

   collapseAll(i: number) {
      this.faqData[i].faq.forEach((v: any) => v.collapse = 1)
   }
}
