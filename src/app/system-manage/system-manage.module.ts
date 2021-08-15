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
import { AuthorizeComponent } from './authorize/authorize.component';
import { FlowDesignComponent } from './flow-design/flow-design.component';
import { FlowCrudOperationComponent } from './flow-manage/flow-crud-opeartion.component';
import { FlowManageComponent } from './flow-manage/flow-manage.component';
import { FormDesignVisualComponent } from './form-design-visual/form-design-visual.component';
import { FormDesignComponent } from './form-design/form-design.component';
import { FormCrudOperationComponent } from './form-manage/form-crud-opeartion.component';
import { FormManageComponent } from './form-manage/form-manage.component';
import { GeoprocessingModelDesignComponent } from './geoprocessing-model-design/geoprocessing-model-design.component';
import { GeoprocessingModelCrudOperationComponent } from './geoprocessing-model-manage/geoprocessing-model-crud-opeartion.component';
import { GeoprocessingModelManageComponent } from './geoprocessing-model-manage/geoprocessing-model-manage.component';
import { RoleComponent } from './role/role.component';
import { SystemManageRoutingModule } from './system-manage-routing.module';
import { SystemManageService } from './system-manage.service';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLogComponent } from './user-log/user-log.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AuthorizeComponent,
    RoleComponent,
    UserComponent,
    GeoprocessingModelManageComponent,
    GeoprocessingModelDesignComponent,
    FlowDesignComponent,
    FlowManageComponent,
    UserLogComponent,
    UserInfoComponent,
    FormManageComponent,
    FormDesignComponent,
    FormDesignVisualComponent,
    FlowCrudOperationComponent,
    GeoprocessingModelCrudOperationComponent,
    FormCrudOperationComponent,
    GeoprocessingModelDesignComponent,
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
    SystemManageRoutingModule,
    AgGridModule.withComponents([]),
    NgxTippyModule,
  ],
  providers: [SystemManageService],
})
export class SystemManageModule {}
