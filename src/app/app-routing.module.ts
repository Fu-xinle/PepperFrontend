import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentLayoutComponent } from './shared/layouts/content/content-layout.component';
import { FullLayoutComponent } from './shared/layouts/full/full-layout.component';
import { CONTENT_ROUTES } from './shared/routes/layout-content.routes';
import { DEVELOPMENT_ROUTES } from './shared/routes/layout-development.routes';
import { LocalStoreUtils } from './shared/utils/local-store.utils';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: `${LocalStoreUtils.getItem('layout') ? LocalStoreUtils.getItem('layout') : 'development'}/home`,
    pathMatch: 'full',
  },
  {
    path: 'development',
    component: FullLayoutComponent,
    data: { title: 'development Views' },
    children: DEVELOPMENT_ROUTES,
  },
  {
    path: 'content',
    component: ContentLayoutComponent,
    data: { title: 'content Views' },
    children: CONTENT_ROUTES,
  },
  { path: '**', redirectTo: 'content/system-manage-authorize/error' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      relativeLinkResolution: 'corrected',
      /**路由复用是指当我们离开当前页时若符合复用条件（即：匹配模式）则保存当前路由所有组件状态（包括子组件），
       * 待下一次进入相同路由（即：匹配模式）时再从中缓存中获取到。 */
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
