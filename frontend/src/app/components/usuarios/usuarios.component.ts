import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  nuevoUsuario: any = {
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    pass: '',
    rol: 'NORMAL',
    membresia: ''
  };
  usuarioEditando: any = null;
  membresias: any[] = [];
  mostrarModalCrear: boolean = false;
  mostrarModalEditar: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarMembresias();
  }

  cargarUsuarios(): void {
    this.apiService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    });
  }

  cargarMembresias(): void {
    this.apiService.getMembresias().subscribe({
      next: (data) => {
        this.membresias = data;
      },
      error: (error) => {
        console.error('Error al cargar las membresías:', error);
      }
    });
  }

  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  abrirModalEditar(usuario: any): void {
    this.usuarioEditando = { ...usuario };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }

  crearUsuario(): void {
    this.apiService.createUsuario(this.nuevoUsuario).subscribe({
      next: (response) => {
        console.log('Usuario creado:', response);
        this.cargarUsuarios();
        this.cerrarModalCrear();
      },
      error: (error) => {
        console.error('Error al crear el usuario:', error);
      }
    });
  }

  guardarCambios(): void {
    this.apiService.updateUsuario(this.usuarioEditando).subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        this.cargarUsuarios();
        this.cerrarModalEditar();
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
  }

  cambiarRol(): void {
    if (this.usuarioEditando.rol === 'NORMAL') {
      this.usuarioEditando.rol = 'ADMIN';
    } else {
      this.usuarioEditando.rol = 'NORMAL';
    }
  }

  borrarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar este usuario?')) {
      this.apiService.deleteUsuario(id).subscribe({
        next: (response) => {
          console.log('Usuario borrado:', response);
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al borrar el usuario:', error);
        }
      });
    }
  }
}