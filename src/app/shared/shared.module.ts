/* eslint-disable import/order */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CountdownModule } from 'ngx-countdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';

/** custom components */
import { AppLoadingOverlayComponent } from './components/ag-grid/app-loading-overlay.component';
import { AppNorowsOverlayComponent } from './components/ag-grid/app-no-rows-overlay.component';
import { BtnLoadingComponent } from './components/btn-loading/btn-loading.component';
import { SearchComponent } from './components/search/search.component';
import { CustomizerComponent } from './components/customizer/customizer.component';
import { ZtreeComponent } from './components/ztree/ztree.component';
import { ZtreeSelectComponent } from './components/ztree-select/ztree-select.component';

const customComponents = [
  AppLoadingOverlayComponent,
  AppNorowsOverlayComponent,
  BtnLoadingComponent,
  SearchComponent,
  CustomizerComponent,
  ZtreeComponent,
  ZtreeSelectComponent,
];

/** layouts components */
import { ContentLayoutComponent } from './layouts/content/content-layout.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';

const layoutsComponents = [ContentLayoutComponent, FooterComponent, FullLayoutComponent, HeaderComponent, SidebarComponent];

/** pipes */
import { ExcerptPipe } from './pipes/excerpt.pipe';
import { GetValueByKeyPipe } from './pipes/get-value-by-key.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

const pipes = [ExcerptPipe, GetValueByKeyPipe, RelativeTimePipe];

/** Directives */
import { DropdownToggleDirective } from './directives/dropdown-toggle.directive';
import { DropdownLinkDirective } from './directives/dropdown-link.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { ScrollToDirective } from './directives/scroll-to.directive';
import {
  SidebarDirective,
  SidebarContainerDirective,
  SidebarContentDirective,
  SidebarTogglerDirective,
} from './directives/sidebar.directive';
import { ScreenFullDirective } from './directives/screen-full.directive';

/** outer Service */
import { SystemManageAuthorizeService } from '../system-manage-authorize/system-manage-authorize.service';

const directives = [
  DropdownToggleDirective,
  DropdownLinkDirective,
  DropdownDirective,
  ScrollToDirective,
  SidebarDirective,
  SidebarContainerDirective,
  SidebarContentDirective,
  SidebarTogglerDirective,
  ScreenFullDirective,
];

@NgModule({
  imports: [
    CommonModule,
    CountdownModule,
    PerfectScrollbarModule,
    ToastrModule.forRoot(),
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  declarations: [...customComponents, ...layoutsComponents, ...pipes, ...directives],
  exports: [...customComponents, ...layoutsComponents, ...pipes, ...directives],
  providers: [SystemManageAuthorizeService],
})
export class SharedModule {}
