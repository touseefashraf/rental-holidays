import { ActivatedRoute, Params, Router,NavigationEnd } from '@angular/router'
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { ApiService } from '../../../services/api.service'
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core'
import { ConstantsService } from 'src/app/services/constants.service'
import { TranslateService } from '@ngx-translate/core'
import { filter } from 'rxjs/operators'
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

    cart: any
    filters: any = {
        title: '',
        country: ''
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

        this.route.queryParams.subscribe((param: Params) => {
            // if (param.country) {
            //     this.filters.country = param.country
            // }
        })

        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.loginUpdates()
            }
        })


        // console.log(this.cart);
        // if (this.api.cartData != null) {
        //     this.cart = this.api.cartData.documents.length
        // }
    }
    loginUpdates(): void {
        this.isTenant = this.api.isTenant()
        this.isLandLord = this.api.isLandLord()
        this.isAdmin = this.api.isAdmin()

    }
    ngOnInit() {

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

    setCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }
}
