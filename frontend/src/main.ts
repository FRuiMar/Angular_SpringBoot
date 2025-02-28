import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importa las rutas
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './app/interceptors/jwt.interceptor'; // Importa el interceptor
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import es from '@angular/common/locales/es';

// Registrar el idioma español
registerLocaleData(es);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideRouter(routes), // Configura las rutas
    provideHttpClient(), // Proporciona HttpClient
    { provide: LOCALE_ID, useValue: 'es' }, provideAnimationsAsync(), // Configura el idioma de la aplicación a español
  ],
});
