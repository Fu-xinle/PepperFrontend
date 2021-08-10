import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlgorithmDesignComponent } from './algorithm-design/algorithm-design.component';
import { AlgorithmManageComponent } from './algorithm-manage/algorithm-manage.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { FlowDesignComponent } from './flow-design/flow-design.component';
import { FlowManageComponent } from './flow-manage/flow-manage.component';
import { FormDesignVisualComponent } from './form-design-visual/form-design-visual.component';
import { FormDesignComponent } from './form-design/form-design.component';
import { FormManageComponent } from './form-manage/form-manage.component';
import { RoleComponent } from './role/role.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserLogComponent } from './user-log/user-log.component';
import { UserComponent } from './user/user.component';

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
    path: 'algorithm-manage',
    component: AlgorithmManageComponent,
    data: {
      title: '算法模型管理',
    },
  },
  {
    path: 'algorithm-design',
    component: AlgorithmDesignComponent,
    data: {
      title: '算法模型设计器',
    },
  },
  {
    path: 'flow-design',
    component: FlowDesignComponent,
    data: {
      title: '流程设置',
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
      title: '表单设计页面',
    },
  },
  {
    path: 'form-design-visual',
    component: FormDesignVisualComponent,
    data: {
      title: '表单可视化设计页面',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemManagerRoutingModule {}
