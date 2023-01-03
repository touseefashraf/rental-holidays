import { LandLoardPanelRoutes } from './landlord-panel.routing';
import { ModalModule } from 'ngx-bootstrap/modal'
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar'
import { NgModule } from '@angular/core'


import { LayoutModule } from './layout/layout.module';
import { SidebarComponent } from './sidebar/sidebar.component'
import { LandlordPanelComponent } from './landlord-panel.component';
import { LandLoardSharedModule } from './landlord-shared/landlord-shared.module';

@NgModule({
    imports: [
        ModalModule.forRoot(),
        LandLoardSharedModule,
        LayoutModule,
        LandLoardPanelRoutes,
        NgScrollbarModule
    ],
    providers: [
        {
            provide: NG_SCROLLBAR_OPTIONS,
            useValue: {
            }
        }
    ],
    declarations: [LandlordPanelComponent,SidebarComponent],
    entryComponents: []
})
export class LandLordPanelModule { }
