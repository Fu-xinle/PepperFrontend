import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeBiComponent } from './home-bi/home-bi.component';
import { HomeChatComponent } from './home-chat/home-chat.component';
import { HomeEarthComponent } from './home-earth/home-earth.component';
import { HomeMapComponent } from './home-map/home-map.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent, HomeMapComponent, HomeEarthComponent, HomeBiComponent, HomeChatComponent],
  imports: [CommonModule, HomeRoutingModule, NgbModule],
})
export class HomeModule {}
