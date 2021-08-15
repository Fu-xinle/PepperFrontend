import { Routes } from '@angular/router';

export const CONTENT_ROUTES: Routes = [
  {
    path: 'system-manage-authorize',
    loadChildren: () => import('../../system-manage-authorize/system-manage-authorize.module').then(m => m.SystemManageAuthorizeModule),
  },
];
