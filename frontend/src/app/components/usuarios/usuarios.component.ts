import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  usuariosPaginados: any[] = [];

  // Propiedades para la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;

  // Propiedad para el filtrado
  filtroTexto: string = '';

  // Para usar Math en la plantilla
  Math = Math;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.apiService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filtrarUsuarios();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  abrirFormulario(): void {
    this.router.navigate(['/usuarios/create']);
  }

  abrirModalEditar(usuario: any): void {
    console.log('Navegando a editar usuario con ID:', usuario.id);
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  borrarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.apiService.deleteUsuario(id).subscribe({
        next: (response) => {
          if (response.result === 'ok') {
            // Filtrar el usuario eliminado de la lista
            this.usuarios = this.usuarios.filter(u => u.id !== id);
            this.filtrarUsuarios();
          } else {
            alert('Error al eliminar el usuario: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  // Métodos para la paginación
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarUsuariosPaginados();
    }
  }

  cambiarItemsPorPagina(items: number): void {
    this.itemsPorPagina = items;
    this.paginaActual = 1; // Reiniciar a la primera página
    this.totalPaginas = Math.max(1, Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina)); // Recalcular total de páginas
    this.actualizarUsuariosPaginados(); // Actualizar la lista paginada
  }

  getPaginas(): number[] {
    const paginas: number[] = [];

    // Si no hay páginas, devolver array vacío
    if (this.totalPaginas <= 0) {
      return paginas;
    }

    // Mostrar un máximo de 5 páginas
    let inicio = Math.max(1, this.paginaActual - 2);
    let fin = Math.min(this.totalPaginas, inicio + 4);

    // Ajustar si estamos cerca del final
    if (fin - inicio < 4 && this.totalPaginas > 5) {
      inicio = Math.max(1, fin - 4);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  // Método para filtrado
  filtrarUsuarios(): void {
    const texto = this.filtroTexto.toLowerCase().trim();

    if (!texto) {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      this.usuariosFiltrados = this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.apellido.toLowerCase().includes(texto) ||
        usuario.dni.toLowerCase().includes(texto) ||
        usuario.email.toLowerCase().includes(texto) ||
        usuario.rol.toLowerCase().includes(texto) ||
        usuario.membresia.toString().toLowerCase().includes(texto)
      );
    }

    // Actualizar información de paginación
    this.totalPaginas = Math.max(1, Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina));
    console.log(`Total páginas después de filtrar: ${this.totalPaginas} (${this.usuariosFiltrados.length}/${this.itemsPorPagina})`);

    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = 1;
    }

    this.actualizarUsuariosPaginados();
  }

  private actualizarUsuariosPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    this.usuariosPaginados = this.usuariosFiltrados.slice(inicio, fin);
  }

}