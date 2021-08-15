import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ErrorComponent } from './error/error.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SystemManageAuthorizeRoutingModule } from './system-manage-authorize-routing.module';
import { SystemManageAuthorizeService } from './system-manage-authorize.service';

@NgModule({
  declarations: [ErrorComponent, ForgetPasswordComponent, LoginComponent, RegisterComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SystemManageAuthorizeRoutingModule, SharedModule],
  providers: [SystemManageAuthorizeService],
})
export class SystemManageAuthorizeModule {}
