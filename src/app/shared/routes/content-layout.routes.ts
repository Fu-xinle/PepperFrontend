import { Routes } from '@angular/router';

export const CONTENT_ROUTES: Routes = [
  {
    path: 'system-manager-authorize',
    loadChildren: () => import('../../system-manager-authorize/system-manager-authorize.module').then(m => m.SystemManagerAuthorizeModule),
  },
];
