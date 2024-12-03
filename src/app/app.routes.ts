import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Import components
import { StarshipsComponent } from './pages/starships/starships.component';
import { FilterComponent } from './pages/filter/filter.component';

// Define routes
export const routes: Routes = [
  { path: '', redirectTo: 'starships', pathMatch: 'full' },
  { path: 'starships', component: StarshipsComponent },
  { path: 'filter', component: FilterComponent },
];

export const appRouterProvider = provideRouter(routes);
