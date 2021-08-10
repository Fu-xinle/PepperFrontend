import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule, NgbDatepickerModule, NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
// eslint-disable-next-line import/no-unassigned-import
import 'ag-grid-enterprise';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { SharedModule } from '../shared/shared.module';
import { AlgorithmDesignComponent } from './algorithm-design/algorithm-design.component';
import { AlgorithmCrudOperationComponent } from './algorithm-manage/algorithm-crud-opeartion.component';
import { AlgorithmManageComponent } from './algorithm-manage/algorithm-manage.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { FlowDesignComponent } from './flow-design/flow-design.component';
import { FlowCrudOperationComponent } from './flow-manage/flow-crud-opeartion.component';
import { FlowManageComponent } from './flow-manage/flow-manage.component';
import { FormDesignVisualComponent } from './form-design-visual/form-design-visual.component';
import { FormDesignComponent } from './form-design/form-design.component';
import { FormCrudOperationComponent } from './form-manage/form-crud-opeartion.component';
import { FormManageComponent } from './form-manage/form-manage.component';
import { RoleComponent } from './role/role.component';
import { SystemManagerRoutingModule } from './system-manager-routing.module';
import { SystemManagerService } from './system-manager.service';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLogComponent } from './user-log/user-log.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AuthorizeComponent,
    RoleComponent,
    UserComponent,
    AlgorithmManageComponent,
    AlgorithmDesignComponent,
    FlowDesignComponent,
    FlowManageComponent,
    UserLogComponent,
    UserInfoComponent,
    FormManageComponent,
    FormDesignComponent,
    FormDesignVisualComponent,
    FlowCrudOperationComponent,
    AlgorithmCrudOperationComponent,
    FormCrudOperationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbPopoverModule,
    ImageCropperModule,
    NgSelectModule,
    SharedModule,
    SystemManagerRoutingModule,
    AgGridModule.withComponents([]),
    NgxTippyModule,
  ],
  providers: [SystemManagerService],
})
export class SystemManagerModule {}
