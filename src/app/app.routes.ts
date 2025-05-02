import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'readmes',
    loadComponent: () => import('./components/readmes/readmes.component').then(m => m.ReadmesComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];