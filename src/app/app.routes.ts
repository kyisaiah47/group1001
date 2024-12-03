import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { StarshipsComponent } from './pages/starships/starships.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'starships', component: StarshipsComponent },
  { path: '**', redirectTo: '' },
];

export const appRouterProvider = provideRouter(routes);
