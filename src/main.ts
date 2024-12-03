import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appRouterProvider } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    appRouterProvider,
    importProvidersFrom(CommonModule),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
