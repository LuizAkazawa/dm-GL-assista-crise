import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'ecomApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'crise',
    data: { pageTitle: 'ecomApp.crise.home.title' },
    loadChildren: () => import('./crise/crise.routes'),
  },
  {
    path: 'demande',
    data: { pageTitle: 'ecomApp.demande.home.title' },
    loadChildren: () => import('./demande/demande.routes'),
  },
  {
    path: 'offre',
    data: { pageTitle: 'ecomApp.offre.home.title' },
    loadChildren: () => import('./offre/offre.routes'),
  },
  {
    path: 'information',
    data: { pageTitle: 'ecomApp.information.home.title' },
    loadChildren: () => import('./information/information.routes'),
  },
  {
    path: 'utilisateur',
    data: { pageTitle: 'ecomApp.utilisateur.home.title' },
    loadChildren: () => import('./utilisateur/utilisateur.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
