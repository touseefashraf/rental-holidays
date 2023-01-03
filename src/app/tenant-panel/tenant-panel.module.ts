import { ModalModule } from 'ngx-bootstrap/modal'
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar'
import { NgModule } from '@angular/core'


import { LayoutModule } from './layout/layout.module';
import { TenantSharedModule } from './tenant-shared/tenant-shared.module'
import { SidebarComponent } from './sidebar/sidebar.component'
import { TenantPanelComponent } from './tenant-panel.component';
import { TenantPanelRoutes } from './tenant-panel.routing';

@NgModule({
    imports: [
        ModalModule.forRoot(),
        TenantSharedModule,
        LayoutModule,
        TenantPanelRoutes,
        NgScrollbarModule
    ],
    providers: [
        {
            provide: NG_SCROLLBAR_OPTIONS,
            useValue: {
            }
        }
    ],
    declarations: [TenantPanelComponent,SidebarComponent],
    entryComponents: []
})
export class TenantPanelModule { }
