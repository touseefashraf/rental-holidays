import { IAlertService } from './../../libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './data.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-payment-process',
    templateUrl: './payment-process.component.html',
    styleUrls: ['./payment-process.component.css']
})
export class PaymentProcessComponent implements OnInit {
    message: any
    dataStatus = 'featch'
    downloading = false
    cartId: any
    alreadyDownloaded = false
    constructor(
        private ds: DataService,
        public route: ActivatedRoute,
        public router: Router,
        public api: ApiService,
        public alert: IAlertService
    ) {
        this.message = this.route.snapshot.paramMap.get('message')
        this.cartId = this.route.snapshot.paramMap.get('cartId')
        if (this.message == 'success') {
            this.ds.downloadFolder(this.cartId).subscribe((resp: any) => {
                console.log('ss',resp.status)
                if (resp.status == 202) {
                    this.alreadyDownloaded = true
                    this.downloading = true
                    this.alert.error('You have already downloaded files.')

                    return false
                }
                console.log('resp type=', resp.type)
                const binaryData = []
                binaryData.push(resp.body)
                const downloadLink = document.createElement('a')
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: resp.body.type }))
                downloadLink.setAttribute('download', 'document')
                document.body.appendChild(downloadLink)
                downloadLink.click()
                this.downloading = true
                localStorage.removeItem('cart')
                this.api.cartItmes.next(0)
                this.api.cartData = null
            })
        } else {
            this.router.navigate(['/cart'])
        }

        console.log(this.message);
        console.log(this.cartId);

    }

    ngOnInit() {
    }

}
