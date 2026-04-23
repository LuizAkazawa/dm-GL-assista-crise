import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import InformationResolve from './route/information-routing-resolve.service';

const informationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/information.component').then(m => m.InformationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/information-detail.component').then(m => m.InformationDetailComponent),
    resolve: {
      information: InformationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/information-update.component').then(m => m.InformationUpdateComponent),
    resolve: {
      information: InformationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/information-update.component').then(m => m.InformationUpdateComponent),
    resolve: {
      information: InformationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default informationRoute;
