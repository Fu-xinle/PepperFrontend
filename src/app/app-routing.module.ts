import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * 页面共三种布局
 * CONTENT布局：用于登录、注册、错误、空白等页面，没有Navbar和Sidebar
 * FULL布局：包含Navbar和Sidebar,页面为流式布局，整个页面滚动
 * FIX布局：包含Navbar和Sidebar,页面为100%高度，通过FULL布局特定的CSS样式实现
 */
import { ContentLayoutComponent } from './shared/layouts/content/content-layout.component';
import { FullLayoutComponent } from './shared/layouts/full/full-layout.component';
import { CONTENT_ROUTES } from './shared/routes/content-layout.routes';
import { FULL_ROUTES } from './shared/routes/full-layout.routes';

const appRoutes: Routes = [
  { path: '', redirectTo: 'full/home', pathMatch: 'full' },
  {
    path: 'full',
    component: FullLayoutComponent,
    data: { title: 'full Views' },
    children: FULL_ROUTES,
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
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
