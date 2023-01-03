import { TranslateService } from '@ngx-translate/core';
import { Event, Router } from '@angular/router'
import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isLoading: boolean

    constructor(
        private route: Router,
        public ts: TranslateService
    ) {
        ts.addLangs(['en', 'de', 'nl'])
        const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : ts.getBrowserLang()
        console.log('APP: Current language', lang)
        ts.setDefaultLang(lang)
        ts.use(lang)
        this.route.events.subscribe((routerEvent: Event) => {
        })
    }
}
