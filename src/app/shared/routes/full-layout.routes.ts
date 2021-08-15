import { Routes } from '@angular/router';

import { AuthGuard } from '../services/auth/auth-guard.service';

export const FULL_ROUTES: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../../home/home.module').then(m => m.HomeModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'system-manage',
    loadChildren: () => import('../../system-manage/system-manage.module').then(m => m.SystemManageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'technology-research',
    loadChildren: () => import('../../technology-research/technology-research.module').then(m => m.TechnologyResearchModule),
    canLoad: [AuthGuard],
  },
];
