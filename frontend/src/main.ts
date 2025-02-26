import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importa las rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Configura HttpClient
    provideRouter(routes), provideAnimationsAsync(), // Configura las rutas
  ],
});