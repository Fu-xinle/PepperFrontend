import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizeComponent } from './authorize/authorize.component';
import { FlowDesignComponent } from './flow-design/flow-design.component';
import { FlowManageComponent } from './flow-manage/flow-manage.component';
import { FormDesignComponent } from './form-design/form-design.component';
import { FormManageComponent } from './form-manage/form-manage.component';
import { GeoprocessingModelDesignComponent } from './geoprocessing-model-design/geoprocessing-model-design.component';
import { GeoprocessingModelManageComponent } from './geoprocessing-model-manage/geoprocessing-model-manage.component';
import { RoleComponent } from './role/role.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLogComponent } from './user-log/user-log.component';
import { UserComponent } from './user/user.component';
import { WorkflowManageComponent } from './workflow-manage/workflow-manage.component';

const routes: Routes = [
  {
    path: 'authorize',
    component: AuthorizeComponent,
    data: {
      title: '权限配置',
    },
  },
  {
    path: 'role',
    component: RoleComponent,
    data: {
      title: '角色配置',
    },
  },
  {
    path: 'user',
    component: UserComponent,
    data: {
      title: '用户设置',
    },
  },
  {
    path: 'user-log',
    component: UserLogComponent,
    data: {
      title: '用户日志管理',
    },
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
    data: {
      title: '用户信息管理',
    },
  },
  {
    path: 'geoprocessing-model-manage',
    component: GeoprocessingModelManageComponent,
    data: {
      title: '地理处理模型管理',
    },
  },
  {
    path: 'geoprocessing-model-design',
    component: GeoprocessingModelDesignComponent,
    data: {
      title: '地理处理模型设计器',
    },
  },
  {
    path: 'workflow-manage',
    component: WorkflowManageComponent,
    data: {
      title: '工作流管理',
    },
  },
  {
    path: 'flow-manage',
    component: FlowManageComponent,
    data: {
      title: '流程管理',
    },
  },
  {
    path: 'flow-design',
    component: FlowDesignComponent,
    data: {
      title: '流程设计',
    },
  },
  {
    path: 'form-manage',
    component: FormManageComponent,
    data: {
      title: '表单管理',
    },
  },
  {
    path: 'form-design',
    component: FormDesignComponent,
    data: {
      title: '表单设计',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemManageRoutingModule {}
