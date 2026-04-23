import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import DemandeResolve from './route/demande-routing-resolve.service';

const demandeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/demande.component').then(m => m.DemandeComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/demande-detail.component').then(m => m.DemandeDetailComponent),
    resolve: {
      demande: DemandeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/demande-update.component').then(m => m.DemandeUpdateComponent),
    resolve: {
      demande: DemandeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/demande-update.component').then(m => m.DemandeUpdateComponent),
    resolve: {
      demande: DemandeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default demandeRoute;
