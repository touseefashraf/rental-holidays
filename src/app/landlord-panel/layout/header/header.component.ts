import { ActivatedRoute, Params, Router } from '@angular/router'
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { ApiService } from '../../../services/api.service'
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core'
import { ConstantsService } from 'src/app/services/constants.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: false, autoClose: true } }]
})
export class HeaderComponent implements OnInit, AfterViewInit {
    isCollapsed = true
    carSubscribe: any
    isAuthenticated = false
    isTenant = false
    isLandLord = false
    isAdmin = false
    isDeo = false
    cart: any
    filters: any = {
        title: '',
        country:''
    }
    languages = this.cs.LANGUAGES
    constructor(
        public api: ApiService,
        public cs: ConstantsService,
        public router: Router,
        private route: ActivatedRoute,
        public renderer2: Renderer2,
        public ts: TranslateService
    ) {


        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.loginUpdates()
            }
        })

        this.carSubscribe = this.api.cartItmes.subscribe(resp => {
            this.cart = resp
            console.log('value got in header', resp)
        })
        // console.log(this.cart);
        // if (this.api.cartData != null) {
        //     this.cart = this.api.cartData.documents.length
        // }
    }
    loginUpdates(): void {
        this.isTenant = this.api.isTenant()
        this.isAdmin = this.api.isAdmin()
        this.isLandLord = this.api.isLandLord()
        
    }
    ngOnInit() {
    }
    redirectToSearch() {
        const filtersParam = {
            country: this.filters.country,
            title: this.filters.title,
            page: 1
        }
        this.router.navigate(['/search'], { queryParams: filtersParam, replaceUrl: true })
    }
    ngAfterViewInit() {
    }

    logOut(): void {
        this.api.logOutSession().subscribe((resp: any) => {
            const check = this.api.logOut()
            if (check) {
                location.reload()
            }
        })
    }
}
