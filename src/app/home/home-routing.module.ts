import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeBiComponent } from './home-bi/home-bi.component';
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
    path: 'home-bi',
    component: HomeBiComponent,
    data: {
      title: '主页-BI风格',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
