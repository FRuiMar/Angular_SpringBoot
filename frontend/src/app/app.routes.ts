import { Routes } from '@angular/router';


import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClasesGymComponent } from './components/clases-gym/clases-gym.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { EntrenadoresComponent } from './components/entrenadores/entrenadores.component';
import { ReservasComponent } from './components/reservas/reservas.component';

export const routes: Routes = [

  { path: '', component: HomeComponent }, // Esto es la página de inicio o Home, que es bueno crear una al parecer.
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'clases', component: ClasesGymComponent },
  { path: 'users', component: UsuariosComponent },
  { path: 'entrenadores', component: EntrenadoresComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: '**', redirectTo: '' },  //con esto redirigo a la página de inicio si no encuentor la ruta que meto

];
