import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

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
import { UsuarioCreateComponent } from './components/admin/usuario-create/usuario-create.component';
import { MembresiaListComponent } from './components/admin/membresia-list/membresia-list.component';
import { MembresiaCreateComponent } from './components/admin/membresia-create/membresia-create.component';
import { MembresiaEditComponent } from './components/admin/membresia-edit/membresia-edit.component';



export const routes: Routes = [
  // Rutas públicas (accesibles para todos)
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'clases', component: ClasesGymComponent },



  // ACCESO USUARIO AUTENTICADO (poder hacer reservas)
  {
    path: 'reservas/usuario',
    component: ReservasUsuarioComponent,
    canActivate: [AuthGuard]
  },




  // ACCESO SOLO ADMINISTRADOR
  //Gestión de usuarios (administrador)
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'usuarios/editar/:id',
    component: UsuarioEditComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'usuarios/create',
    component: UsuarioCreateComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'users',
    component: UsuariosComponent,
    canActivate: [AdminGuard]
  },


  // Gestión de entrenadores (administrador)
  {
    path: 'entrenadores',
    component: EntrenadoresComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'entrenadores/create',
    component: EntrenadorCreateComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'entrenadores/edit/:id',
    component: EntrenadorEditComponent,
    canActivate: [AdminGuard]
  },


  // Gestión de clases (administrador)
  {
    path: 'clases/create',
    component: ClasesCreateComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'clases/edit/:id',
    component: ClasesEditComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'clases/list',
    component: ClasesListComponent,
    canActivate: [AdminGuard]
  },


  // Gestión de reservas (administrador)
  {
    path: 'reservas',
    component: ReservasComponent,
    canActivate: [AdminGuard]
  },


  // Gestión de membresías (administrador)
  {
    path: 'membresias',
    component: MembresiaListComponent,
    canActivate: [AdminGuard]  // Usando el mismo guard que para otras rutas de admin
  },
  {
    path: 'membresias/create',
    component: MembresiaCreateComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'membresias/edit/:id',
    component: MembresiaEditComponent,
    canActivate: [AdminGuard]
  },






  // REDIRECCIÓN POR DEFECTO
  { path: '**', redirectTo: '' },  //con esto redirigo a la página de inicio si no encuentor la ruta que meto

];
