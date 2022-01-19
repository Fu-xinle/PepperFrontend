import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeBiComponent } from './home-bi/home-bi.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent, HomeBiComponent],
  imports: [CommonModule, HomeRoutingModule, NgbModule],
})
export class HomeModule {}
