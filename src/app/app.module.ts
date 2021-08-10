import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultInterceptor } from './shared/services/interceptor/default.interceptor';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 60000,
      extendedTimeOut: 60000,
      progressBar: true,
      enableHtml: true,
    }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
