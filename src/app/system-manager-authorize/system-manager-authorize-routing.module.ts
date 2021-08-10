import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    data: {
      title: '页面错误',
    },
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    data: {
      title: '忘记密码',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: '登录',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: '注册',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemManagerAuthorizeRoutingModule {}
