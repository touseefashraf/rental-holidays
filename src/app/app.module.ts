import { ConstantsServiceFR } from './services/constants.serviceFR';
import { ConstantsServiceNL } from './services/constants.serviceNL';
import { ConstantsServiceDE } from './services/constants.serviceDE';
import { LayoutModule } from './website/layout/layout.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SharedModule } from './website/shared/shared.module'
import { UIHelpers } from './helpers/ui-helpers'
import { HttpErrorsInterceptorService } from './interceptors/http-errors-interceptor.service'
import { ConstantsService } from './services/constants.service'
import { ApiInterceptorsService } from './interceptors/api-interceptors.service'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { QuillModule } from 'ngx-quill'
import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        QuillModule.forRoot(),
        BrowserAnimationsModule,
        AppRoutes,
        LayoutModule,
        SharedModule,
        HttpClientModule,
        NgScrollbarModule,
        TranslateModule.forRoot({
            // defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        ConstantsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptorsService,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorsInterceptorService,
            multi: true
        },
        UIHelpers
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http)
}

export function ConstantsServiceFactoryProvider(translate: TranslateService) {
    switch (localStorage.getItem('lang')) {
        case 'en': {
            return new ConstantsService()
        }
        case 'de': {
            return new ConstantsServiceDE()
        }
        case 'nl': {
            return new ConstantsServiceNL()
        } case 'fr': {
            return new ConstantsServiceFR()
        }
        default: {
            return new ConstantsService()
        }
    }
}