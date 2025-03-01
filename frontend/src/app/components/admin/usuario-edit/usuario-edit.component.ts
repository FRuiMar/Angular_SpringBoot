import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-edit.component.html',
  styleUrl: './usuario-edit.component.css'
})

export class UsuarioEditComponent implements OnInit {
  usuario: any = {
    id: 0,
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    membresia: '',
    imagen: null
  };

  listaMembresias: any[] = []; // Lista de membresías cargada desde la BD

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.cargarMembresias().then(() => {
      this.cargarUsuario(id);
    });
  }

  async cargarMembresias(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getMembresias().subscribe({
        next: (data) => {
          this.listaMembresias = data;
          //console.log('Membresías cargadas:', this.listaMembresias); // Verifica las membresías cargadas
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar las membresías:', error);
          reject(error);
        }
      });
    });
  }

  cargarUsuario(id: number): void {
    this.apiService.getUsuarioById(id).subscribe({
      next: (data) => {
        this.usuario = { ...data };

        // Buscar la membresía correspondiente en listaMembresias
        const membresiaUsuario = this.listaMembresias.find(
          (mem) => mem.tipo === data.membresia
        );

        // Asignar el ID de la membresía al usuario
        if (membresiaUsuario) {
          this.usuario.membresia = membresiaUsuario.id;
        } else {
          console.error('No se encontró la membresía del usuario en la lista.');
        }

        console.log('Usuario cargado:', this.usuario);
        console.log('Membresía del usuario:', this.usuario.membresia);
      },
      error: (error) => console.error('Error al cargar usuario:', error)
    });
  }

  cambiarRol(): void {
    this.usuario.rol = this.usuario.rol === 'ADMIN' ? 'NORMAL' : 'ADMIN';
    console.log('Nuevo rol:', this.usuario.rol);
  }

  onSubmit(): void {
    const usuarioAEnviar = {
      id: this.usuario.id,
      dni: this.usuario.dni,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email,
      rol: this.usuario.rol,
      membresia: this.usuario.membresia,
      imagen: this.usuario.imagen
    };

    console.log('EDIT Enviando usuario:', usuarioAEnviar);

    this.apiService.updateUsuario(usuarioAEnviar).subscribe({
      next: () => {
        alert('Usuario actualizado con éxito');
        this.router.navigate(['/usuarios']);
      },
      error: (error) => console.error('Error al actualizar usuario:', error)
    });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}
