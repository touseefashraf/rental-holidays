import { Params, Router } from '@angular/router';
import { DataService } from './data.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-my-booking',
    templateUrl: './my-booking.component.html',
    styleUrls: ['./my-booking.component.css']
})
export class MyBookingComponent implements OnInit {
    bookingRequestList: any = []
    dataStatus = 'fetching'
    selectedIndex: any
    searchLoading = false
    loaderOptions = {
        rows: 3,
        cols: 6,
        colSpans: {
            0: 1,
        }
    }
    filters: any = {
        status: ''
    }
    status: Array<any> = ['approved', 'rejected', 'pending', 'CBT']

    constructor(
        public alert: IAlertService,
        private ds: DataService,
        private router: Router
    ) {
        this.ds.tanentBookingRequestList().subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.bookingRequestList = resp.data
                // console.log('bookingRequestList', this.bookingRequestList)
                this.dataStatus = 'done'
            }
        })
    }

    ngOnInit() {
    }

    cancelRequest(id: any, i: any) {
        console.log('Cancel Request Called')
        this.selectedIndex = i
        const params = {
            booking_request_id: id
        }
        this.ds.cancelBookingRequest(params).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.alert.success('Your request has been cancel successfully!!')
                this.bookingRequestList[this.selectedIndex].status = 'CBT'
            }
        })
    }

    getStatusFormat(status: string) {
        const statusFormat = {
            pending: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            CBT: 'Cancel by Tanent',
        }

        return statusFormat[status]
    }

    getStatusClass(status: string) {
        const statusFormat = {
            pending: 'i-badge sm yellow',
            approved: 'i-badge sm green',
            rejected: 'i-badge sm red',
            CBT: 'i-badge sm red',
        }

        return statusFormat[status]
    }

    getBookingRequests() {
        this.searchLoading = true
        const paramsToSend: any = { ...this.filters }
        this.ds.requestBookingSearch(paramsToSend).subscribe((resp: any) => {
            this.searchLoading = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.searchLoading = false

                return false
            } else {
                this.bookingRequestList = resp.data
                this.router.navigate(['/tenant/my-booking'], { queryParams: paramsToSend, replaceUrl: true })
            }
        })
    }

}
