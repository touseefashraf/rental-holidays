import { trigger, transition, style, animate } from '@angular/animations'
import { ApiService } from './../services/api.service'
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router'
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core'
import { NgScrollbar } from 'ngx-scrollbar'
import { WebsiteService } from '../services/website.service';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-website',
    templateUrl: './website.component.html',
    styleUrls: ['./website.component.css'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('500ms ease-in', style({ transform: 'translateX(0%)' }))
            ]),
            transition(':leave', [
                animate('500ms ease-in', style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class WebsiteComponent implements OnInit {
    // @ViewChild(NgScrollbar, { static: true }) scrollbarRef: NgScrollbar
    isLoading: boolean
    scrollbarSub: any

    constructor(
        private route: Router,
        public api: ApiService,
        public web: WebsiteService
    ) {
    }

    ngOnInit() {

        this.route.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const strArr = event.url.split('/')

                if (strArr.length > 0) {

                    const index = this.api.blackUrlends.findIndex(d => d == strArr[strArr.length - 1])
                    console.log(index)
                    if (index > -1) {
                        this.api.headerType = 'white'
                    } else {
                        this.api.headerType = 'black'
                    }

                }

            }
        })
    }

    // ngAfterViewInit(): void {
    //     this.scrollbarSub = this.scrollbarRef.scrolled
    //         .subscribe(e => {
    //             const getHight = e.target.scrollHeight - e.target.scrollTop
    //             if ((getHight - e.target.clientHeight) < 500) {
    //                 // console.log(getHight, e.target.clientHeight, getHight - e.target.clientHeight)
    //                 this.api.toggleScrollBottom(true)
    //             } else {
    //                 this.api.toggleScrollBottom(false)
    //             }
    //         })
    // }

    // ngOnDestroy(): void {
    //     this.scrollbarSub.unsubscribe()
    // }
}
