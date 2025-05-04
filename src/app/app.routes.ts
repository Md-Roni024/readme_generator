import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReadmesComponent } from './components/readmes/readmes.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'readmes',
    component: ReadmesComponent,
  },
  {
    path: 'edit-readme/:id',
    component: HomeComponent,
  }
];