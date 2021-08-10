import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeBiComponent } from './home-bi/home-bi.component';
import { HomeChatComponent } from './home-chat/home-chat.component';
import { HomeEarthComponent } from './home-earth/home-earth.component';
import { HomeMapComponent } from './home-map/home-map.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: '主页',
    },
  },
  {
    path: 'home-earth',
    component: HomeEarthComponent,
    data: {
      title: '主页-三维地球',
    },
  },
  {
    path: 'home-map',
    component: HomeMapComponent,
    data: {
      title: '主页-二维地图',
    },
  },
  {
    path: 'home-bi',
    component: HomeBiComponent,
    data: {
      title: '主页-BI风格',
    },
  },
  {
    path: 'home-chat',
    component: HomeChatComponent,
    data: {
      title: '主页-聊天组件',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
