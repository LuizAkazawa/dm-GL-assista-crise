import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import OffreResolve from './route/offre-routing-resolve.service';

const offreRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/offre.component').then(m => m.OffreComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/offre-detail.component').then(m => m.OffreDetailComponent),
    resolve: {
      offre: OffreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/offre-update.component').then(m => m.OffreUpdateComponent),
    resolve: {
      offre: OffreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/offre-update.component').then(m => m.OffreUpdateComponent),
    resolve: {
      offre: OffreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default offreRoute;
