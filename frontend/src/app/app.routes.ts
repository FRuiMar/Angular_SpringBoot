import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';


export const routes: Routes = [

  {
    path: 'usuarios', //la url que quiero usar
    component: UsuariosComponent //el componente que quiero cargar
  },

];
