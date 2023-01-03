import { Injectable } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'

@Injectable({
    providedIn: 'root'
})
export class AdminSidebarService {
    toggled = false
    _hasBackgroundImage = true
    menus = []

    constructor(public api: ApiService) {

        this.menus = [
            {
                title: 'Dashboard',
                link: 'dashboard',
                icon: 'fa fa-tachometer-alt',
                active: true,
                type: 'simple'
            },
            {
                title: 'Contact Us',
                link: 'contact-us',
                icon: 'fa fa-address-book',
                active: true,
                type: 'simple'
            },
            {
                title: 'Amenities',
                link: 'amenities',
                icon: 'fas fa-hotel',
                active: true,
                type: 'simple'
            },
            {
                title: 'Users',
                icon: 'fas fa-users',
                active: false,
                type: 'dropdown',
                submenus: [
                    {
                        title: 'Tanents',
                        link: 'tanents',
                        type: 'simple'
                    },
                    {
                        title: 'Landlords',
                        link: 'landlords',
                        type: 'simple'
                    }

                ]
            },
            {
                title: 'FAQ Category',
                link: 'faq-categories',
                icon: 'fas fa-list',
                active: false,
                type: 'simple'
            },
            // {
            //     title: 'Transaction History',
            //     link: 'transaction-history',
            //     icon: 'fas fa-file-invoice-dollar',
            //     active: false,
            //     type: 'simple'
            // },
            {
                title: 'Blogs',
                link: 'blogs',
                icon: 'fas fa-list',
                active: false,
                type: 'simple'
            }
        ] // menu
    }

    toggle() {
        this.toggled = !this.toggled
    }

    getSidebarState() {
        return this.toggled
    }

    setSidebarState(state: boolean) {
        this.toggled = state
    }

    getMenuList() {
        return this.menus
    }

    get hasBackgroundImage() {
        return this._hasBackgroundImage
    }

    set hasBackgroundImage(hasBackgroundImage) {
        this._hasBackgroundImage = hasBackgroundImage
    }
}
