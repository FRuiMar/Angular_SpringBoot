import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Importa las rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Configura HttpClient
    provideRouter(routes), // Configura las rutas
  ],
});