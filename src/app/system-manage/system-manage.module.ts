import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule, NgbDatepickerModule, NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
// eslint-disable-next-line import/no-unassigned-import
import 'ag-grid-enterprise';
import { NgxTippyModule, NgxTippyService } from 'ngx-tippy-wrapper';

// rappid
import { BatchDirective } from '../../assets/non-npm/angular-rappid/directives/batch.directive';
// eslint-disable-next-line max-len
import { FlowNodeInspectorComponent } from '../../assets/non-npm/angular-rappid/inspector/flow-node-inspector/flow-node-inspector.component';
// eslint-disable-next-line max-len
import { GeoprocessingModelNodeInspectorComponent } from '../../assets/non-npm/angular-rappid/inspector/geoprocessing-model-node-inspector/geoprocessing-model-node-inspector.component';
import { InspectorComponent } from '../../assets/non-npm/angular-rappid/inspector/inspector.component';
import { LabelInspectorComponent } from '../../assets/non-npm/angular-rappid/inspector/label-inspector/label-inspector.component';
import { LinkInspectorComponent } from '../../assets/non-npm/angular-rappid/inspector/link-inspector/link-inspector.component';
import { EventBusService } from '../../assets/non-npm/angular-rappid/services/event-bus.service';
// ztree
// component
import { SharedModule } from '../shared/shared.module';
import { AuthorizeComponent } from './authorize/authorize.component';
import { FlowDesignComponent } from './flow-design/flow-design.component';
import { FlowCrudOperationComponent } from './flow-manage/flow-crud-opeartion.component';
import { FlowManageComponent } from './flow-manage/flow-manage.component';
import { FormDesignComponent } from './form-design/form-design.component';
import { FormCrudOperationComponent } from './form-manage/form-crud-opeartion.component';
import { FormManageComponent } from './form-manage/form-manage.component';
import { GeoprocessingModelDesignComponent } from './geoprocessing-model-design/geoprocessing-model-design.component';
import { GeoprocessingModelCrudOperationComponent } from './geoprocessing-model-manage/geoprocessing-model-crud-opeartion.component';
import { GeoprocessingModelManageComponent } from './geoprocessing-model-manage/geoprocessing-model-manage.component';
import { RoleComponent } from './role/role.component';
import { AuthorizeManageService } from './service/authorize-manage.service';
import { FlowManageService } from './service/flow-manage.service';
import { FormManageService } from './service/form-manage.service';
import { GeoprocessingModelService } from './service/geoprocessing-model.service';
import { LogManageService } from './service/log-manage.service';
import { PersonalCenterService } from './service/personal-center.service';
import { RoleManageService } from './service/role-manage.service';
import { UserManageService } from './service/user-manage.service';
import { WorkflowManageService } from './service/workflow-manage.service';
import { SystemManageRoutingModule } from './system-manage-routing.module';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLogComponent } from './user-log/user-log.component';
import { UserComponent } from './user/user.component';
import { WorkflowManageComponent } from './workflow-manage/workflow-manage.component';

@NgModule({
  declarations: [
    AuthorizeComponent,
    RoleComponent,
    UserComponent,
    UserLogComponent,
    UserInfoComponent,
    WorkflowManageComponent,
    FlowCrudOperationComponent,
    FlowManageComponent,
    FlowDesignComponent,
    FormManageComponent,
    FormDesignComponent,
    FormCrudOperationComponent,
    GeoprocessingModelCrudOperationComponent,
    GeoprocessingModelManageComponent,
    GeoprocessingModelDesignComponent,
    InspectorComponent,
    GeoprocessingModelNodeInspectorComponent,
    FlowNodeInspectorComponent,
    LabelInspectorComponent,
    LinkInspectorComponent,
    BatchDirective,
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
  providers: [
    AuthorizeManageService,
    FlowManageService,
    FormManageService,
    GeoprocessingModelService,
    LogManageService,
    PersonalCenterService,
    RoleManageService,
    UserManageService,
    WorkflowManageService,
    EventBusService,
    NgxTippyService,
  ],
})
export class SystemManageModule {}
