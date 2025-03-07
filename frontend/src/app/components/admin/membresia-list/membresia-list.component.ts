import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-membresia-list',
  templateUrl: './membresia-list.component.html',
  styleUrls: ['./membresia-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MembresiaListComponent implements OnInit {
  membresias: any[] = []; // Array para almacenar todas las membresías
  membresiasFiltradas: any[] = []; // Array para membresías filtradas
  membresiasPaginadas: any[] = []; // Array para membresías en la página actual

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
    this.cargarMembresias();
  }

  cargarMembresias(): void {
    this.apiService.getMembresias().subscribe({
      next: (data) => {
        console.log('Membresías obtenidas:', data);
        this.membresias = data;
        this.filtrarMembresias();
      },
      error: (error) => {
        console.error('Error al cargar membresías:', error);
      }
    });
  }

  abrirFormulario(): void {
    this.router.navigate(['/membresias/create']);
  }

  editarMembresia(id: number): void {
    this.router.navigate(['/membresias/edit', id]);
  }

  borrarMembresia(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta membresía?')) {
      this.apiService.deleteMembresia(id).subscribe({
        next: (response) => {
          console.log('Membresía eliminada:', response);
          // Recargar la lista después de eliminar
          this.cargarMembresias();
        },
        error: (error) => {
          console.error('Error al eliminar la membresía:', error);
          alert('Error al eliminar la membresía');
        }
      });
    }
  }

  // Métodos para la paginación
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarMembresiasPaginadas();
    }
  }

  cambiarItemsPorPagina(items: number): void {
    this.itemsPorPagina = items;
    this.paginaActual = 1; // Reset a primera página
    this.filtrarMembresias(); // Recalcula el número de páginas y actualiza los datos paginados
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
  filtrarMembresias(): void {
    const texto = this.filtroTexto?.toLowerCase().trim() || '';

    if (!texto) {
      this.membresiasFiltradas = [...this.membresias];
    } else {
      this.membresiasFiltradas = this.membresias.filter(membresia =>
        (membresia.tipo?.toLowerCase().includes(texto) ?? false) ||
        (String(membresia.precio).includes(texto)) ||
        (String(membresia.duracion_meses).includes(texto)) // Usar el nombre de campo correcto
      );
    }

    // Actualizar información de paginación
    this.totalPaginas = Math.max(1, Math.ceil(this.membresiasFiltradas.length / this.itemsPorPagina));

    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = 1;
    }

    this.actualizarMembresiasPaginadas();
  }

  private actualizarMembresiasPaginadas(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    this.membresiasPaginadas = this.membresiasFiltradas.slice(inicio, fin);
  }
}