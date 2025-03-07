import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-entrenadores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './entrenadores.component.html',
  styleUrls: ['./entrenadores.component.css']
})
export class EntrenadoresComponent implements OnInit {
  entrenadores: any[] = [];
  entrenadoresFiltrados: any[] = [];
  entrenadoresPaginados: any[] = [];

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
    this.cargarEntrenadores();
  }

  cargarEntrenadores(): void {
    this.apiService.getEntrenadores().subscribe({
      next: (data) => {
        this.entrenadores = data;
        this.filtrarEntrenadores();
      },
      error: (error) => {
        console.error('Error al cargar entrenadores:', error);
      }
    });
  }

  abrirModalCrear(): void {
    this.router.navigate(['/entrenadores/create']);
  }

  abrirModalEditar(entrenador: any): void {
    this.router.navigate(['/entrenadores/edit', entrenador.id]);
  }

  borrarEntrenador(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este entrenador?')) {
      this.apiService.deleteEntrenador(id).subscribe({
        next: (response) => {
          if (response.result === 'ok') {
            // Filtrar el entrenador eliminado de la lista
            this.entrenadores = this.entrenadores.filter(e => e.id !== id);
            this.filtrarEntrenadores();
          } else {
            alert('Error al eliminar el entrenador: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error al eliminar entrenador:', error);
          alert('Error al eliminar el entrenador');
        }
      });
    }
  }

  // Métodos para la paginación
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarEntrenadoresPaginados();
    }
  }

  cambiarItemsPorPagina(items: number): void {
    this.itemsPorPagina = items;
    this.paginaActual = 1; // Reset a primera página
    this.filtrarEntrenadores(); // Recalcula el número de páginas y actualiza los datos paginados
  }

  getPaginas(): number[] {
    const paginas: number[] = [];

    // Mostrar un máximo de 5 páginas
    let inicio = Math.max(1, this.paginaActual - 2);
    let fin = Math.min(this.totalPaginas, inicio + 4);

    // Ajustar si estamos cerca del final
    if (fin - inicio < 4) {
      inicio = Math.max(1, fin - 4);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  // Método para filtrado
  filtrarEntrenadores(): void {
    const texto = this.filtroTexto.toLowerCase().trim();

    if (!texto) {
      this.entrenadoresFiltrados = [...this.entrenadores];
    } else {
      this.entrenadoresFiltrados = this.entrenadores.filter(entrenador =>
        entrenador.nombre.toLowerCase().includes(texto) ||
        entrenador.apellido.toLowerCase().includes(texto) ||
        entrenador.dni.toLowerCase().includes(texto) ||
        entrenador.especialidad.toLowerCase().includes(texto)
      );
    }

    // Actualizar información de paginación
    this.totalPaginas = Math.max(1, Math.ceil(this.entrenadoresFiltrados.length / this.itemsPorPagina));

    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = 1;
    }

    this.actualizarEntrenadoresPaginados();
  }

  private actualizarEntrenadoresPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    this.entrenadoresPaginados = this.entrenadoresFiltrados.slice(inicio, fin);
  }
}