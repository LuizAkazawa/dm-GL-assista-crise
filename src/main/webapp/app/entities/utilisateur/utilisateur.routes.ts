import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import UtilisateurResolve from './route/utilisateur-routing-resolve.service';

const utilisateurRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/utilisateur.component').then(m => m.UtilisateurComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/utilisateur-detail.component').then(m => m.UtilisateurDetailComponent),
    resolve: {
      utilisateur: UtilisateurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/utilisateur-update.component').then(m => m.UtilisateurUpdateComponent),
    resolve: {
      utilisateur: UtilisateurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/utilisateur-update.component').then(m => m.UtilisateurUpdateComponent),
    resolve: {
      utilisateur: UtilisateurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default utilisateurRoute;
