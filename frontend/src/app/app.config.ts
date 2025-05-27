import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule }        from '@angular/forms';
import { HttpClientModule }           from '@angular/common/http';
import { routes }                     from './app.routes';

export const AppConfig = {
  apiUrl: 'http://localhost:5001/api' 
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
             provideRouter(routes), 
             provideClientHydration(),
             provideHttpClient(withFetch()),
             importProvidersFrom(ReactiveFormsModule)]
};
