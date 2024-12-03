import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Import components
import { StarshipsComponent } from './pages/starships/starships.component';

// Define routes
export const routes: Routes = [
  { path: '', redirectTo: 'starships', pathMatch: 'full' },
  { path: 'starships', component: StarshipsComponent },
];

export const appRouterProvider = provideRouter(routes);
