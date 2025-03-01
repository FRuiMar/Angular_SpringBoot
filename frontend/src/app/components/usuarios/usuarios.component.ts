import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.apiService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  abrirFormulario(): void {
    this.router.navigate(['/usuarios/register']);
  }

  abrirModalEditar(usuario: any): void {
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  borrarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar este usuario?')) {
      this.apiService.deleteUsuario(id).subscribe({
        next: () => this.cargarUsuarios(),
        error: (error) => console.error('Error al borrar usuario:', error)
      });
    }
  }
}
