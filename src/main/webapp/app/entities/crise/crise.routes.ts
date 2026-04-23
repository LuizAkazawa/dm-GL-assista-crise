import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CriseResolve from './route/crise-routing-resolve.service';

const criseRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/crise.component').then(m => m.CriseComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/crise-detail.component').then(m => m.CriseDetailComponent),
    resolve: {
      crise: CriseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/crise-update.component').then(m => m.CriseUpdateComponent),
    resolve: {
      crise: CriseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/crise-update.component').then(m => m.CriseUpdateComponent),
    resolve: {
      crise: CriseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default criseRoute;
