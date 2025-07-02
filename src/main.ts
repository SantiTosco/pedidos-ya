  import 'zone.js';
  import { bootstrapApplication } from '@angular/platform-browser';
  import { appConfig } from './app/app.config';
  import { AppComponent } from './app/app.component';
  import { provideHttpClient, withInterceptors  } from '@angular/common/http';
  import { importProvidersFrom } from '@angular/core';
  import { provideRouter, RouterModule } from '@angular/router';
  import { routes } from './app/app.routes';
  import { authInterceptor } from './app/guards/auth.interceptor';

  

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))// Habilita HttpClient para toda la app
  ]
}).catch((err) => console.error(err));
