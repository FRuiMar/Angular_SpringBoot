import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clases-list',
  templateUrl: './clases-list.component.html',
  styleUrls: ['./clases-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClasesListComponent implements OnInit {
  clases: any[] = []; // Array para almacenar todas las clases
  clasesFiltradas: any[] = []; // Array para clases filtradas
  clasesPaginadas: any[] = []; // Array para clases en la página actual

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
    this.obtenerClases(); // Mantiene tu método original
  }

  obtenerClases(): void {
    this.apiService.getClasesEntreno().subscribe({
      next: (data) => {
        console.log(data); // Mantenemos tu console.log
        this.clases = data;
        this.filtrarClases(); // Después de obtener los datos, aplicamos filtrado
      },
      error: (error) => console.error('Error al obtener las clases:', error)
    });
  }

  abrirFormulario(): void {
    this.router.navigate(['/clases/create']);
  }

  abrirModalEditar(clase: any): void {
    this.router.navigate(['/clases/edit', clase.id]);
  }

  borrarClase(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar esta clase?')) {
      this.apiService.deleteClaseEntreno(id).subscribe({
        next: () => {
          // Refrescamos la lista después de borrar
          this.obtenerClases();
        },
        error: (error) => console.error('Error al borrar la clase:', error)
      });
    }
  }

  // Nuevos métodos para la paginación
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarClasesPaginadas();
    }
  }

  cambiarItemsPorPagina(items: number): void {
    this.itemsPorPagina = items;
    this.paginaActual = 1; // Reset a primera página
    this.filtrarClases(); // Recalcula el número de páginas y actualiza los datos paginados
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
  filtrarClases(): void {
    const texto = this.filtroTexto?.toLowerCase().trim() || '';

    if (!texto) {
      this.clasesFiltradas = [...this.clases];
    } else {
      this.clasesFiltradas = this.clases.filter(clase =>
        (clase.nombre?.toLowerCase().includes(texto) ?? false) ||
        (clase.horario?.toLowerCase().includes(texto) ?? false) ||
        (clase.entrenador?.toLowerCase().includes(texto) ?? false) ||
        (String(clase.capacidad_maxima).includes(texto))
      );
    }

    // Actualizar información de paginación
    this.totalPaginas = Math.max(1, Math.ceil(this.clasesFiltradas.length / this.itemsPorPagina));

    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = 1;
    }

    this.actualizarClasesPaginadas();
  }

  private actualizarClasesPaginadas(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    this.clasesPaginadas = this.clasesFiltradas.slice(inicio, fin);
  }
}