import { Routes } from '@angular/router';


import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClasesGymComponent } from './components/clases-gym/clases-gym.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { EntrenadoresComponent } from './components/entrenadores/entrenadores.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ClasesCreateComponent } from './components/admin/clases-create/clases-create.component';
import { ClasesEditComponent } from './components/admin/clases-edit/clases-edit.component';
import { ClasesListComponent } from './components/admin/clases-list/clases-list.component';
import { EntrenadorCreateComponent } from './components/admin/entrenador-create/entrenador-create.component';
import { EntrenadorEditComponent } from './components/admin/entrenador-edit/entrenador-edit.component';
import { UsuarioEditComponent } from './components/admin/usuario-edit/usuario-edit.component';
import { ReservasUsuarioComponent } from './components/auth/reservas-usuario/reservas-usuario.component';



export const routes: Routes = [

  { path: '', component: HomeComponent }, // Home

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'usuarios/register', component: RegisterComponent },
  { path: 'usuarios/editar/:id', component: UsuarioEditComponent },
  { path: 'users', component: UsuariosComponent }, //NOTA PARA MI:  luego lo cambio porque puedo usar usuarios que ya tenía. User y usuarios es lo mismo.
  { path: 'usuarios', component: UsuariosComponent },

  { path: 'entrenadores', component: EntrenadoresComponent },
  { path: 'entrenadores/create', component: EntrenadorCreateComponent },
  { path: 'entrenadores/edit/:id', component: EntrenadorEditComponent },

  { path: 'clases', component: ClasesGymComponent },
  { path: 'clases/create', component: ClasesCreateComponent },
  { path: 'clases/edit/:id', component: ClasesEditComponent },
  { path: 'clases/list', component: ClasesListComponent },

  { path: 'reservas', component: ReservasComponent },
  { path: 'reservas/usuario', component: ReservasUsuarioComponent },
  { path: '**', redirectTo: '' },  //con esto redirigo a la página de inicio si no encuentor la ruta que meto

];
