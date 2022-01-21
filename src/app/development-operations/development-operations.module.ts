import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
// eslint-disable-next-line import/no-unassigned-import
import 'ag-grid-enterprise';
import { NgxTippyModule, NgxTippyService } from 'ngx-tippy-wrapper';

import { SharedModule } from '../shared/shared.module';
import { DevelopmentOperationsRoutingModule } from './development-operations-routing.module';
import { KanBanDetailComponent } from './kan-ban-detail/kan-ban-detail.component';
import { KanBanComponent } from './kan-ban/kan-ban.component';
import { KanBanService } from './service/kan-ban.service';
import { WordChineseEnglishService } from './service/word-chinese-english.service';
import { WordChineseEnglishCrudOperationComponent } from './word-chinese-english/word-chinese-english-crud-opeartion.component';
import { WordChineseEnglishComponent } from './word-chinese-english/word-chinese-english.component';

@NgModule({
  declarations: [WordChineseEnglishComponent, WordChineseEnglishCrudOperationComponent, KanBanComponent, KanBanDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    AgGridModule.withComponents([]),
    NgxTippyModule,
    SharedModule,
    DevelopmentOperationsRoutingModule,
  ],
  providers: [NgxTippyService, WordChineseEnglishService, KanBanService],
})
export class DevelopmentOperationsModule {}
