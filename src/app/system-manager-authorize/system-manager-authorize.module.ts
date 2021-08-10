import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ErrorComponent } from './error/error.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SystemManagerAuthorizeRoutingModule } from './system-manager-authorize-routing.module';
import { SystemManagerAuthorizeService } from './system-manager-authorize.service';

@NgModule({
  declarations: [ErrorComponent, ForgetPasswordComponent, LoginComponent, RegisterComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SystemManagerAuthorizeRoutingModule, SharedModule],
  providers: [SystemManagerAuthorizeService],
})
export class SystemManagerAuthorizeModule {}
