import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  providers: [DatePipe]
})
export class ReservasComponent implements OnInit {
  // Datos originales
  reservas: any[] = [];
  usuarios: any[] = [];
  clases: any[] = [];
  reservasCombinadas: any[] = [];

  // Nuevas propiedades para paginación y filtrado
  reservasFiltradas: any[] = [];
  reservasPaginadas: any[] = [];
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;
  filtroTexto: string = '';
  Math = Math;

  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.obtenerReservas();
    this.obtenerUsuarios();
    this.obtenerClases();
  }

  obtenerReservas(): void {
    this.apiService.getReservas().subscribe(
      (data) => {
        console.log('Reservas obtenidas:', data);
        this.reservas = data;
        this.combinarDatos();
      },
      (error) => {
        console.error('Error al obtener las reservas', error);
      }
    );
  }

  obtenerUsuarios(): void {
    this.apiService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.combinarDatos();
      },
      (error) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  obtenerClases(): void {
    this.apiService.getClasesEntreno().subscribe(
      (data) => {
        this.clases = data;
        this.combinarDatos();
      },
      (error) => {
        console.error('Error al obtener las clases', error);
      }
    );
  }

  combinarDatos(): void {
    if (this.reservas.length > 0 && this.usuarios.length > 0 && this.clases.length > 0) {
      console.log('Combinando datos de reservas, usuarios y clases');

      this.reservasCombinadas = this.reservas.map((reserva) => {
        console.log('Procesando reserva:', reserva);
        const usuario = this.usuarios.find((u) => u.id === reserva.usuarioId);
        const clase = this.clases.find((c) => c.id === reserva.claseId);

        return {
          id: reserva.id,
          nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellido || ''}` : 'Desconocido',
          nombreClase: clase ? clase.nombre : 'Desconocido',
          hora: reserva.fechaReserva || reserva.fecha || new Date(),
          nombreEntrenador: clase ? clase.entrenador : 'Desconocido',
        };
      });

      console.log('Reservas combinadas:', this.reservasCombinadas);

      // Una vez combinados los datos, aplicar filtrado y paginación
      this.filtrarReservas();
    }
  }

  formatearFechaConAjuste(fechaStr: any): string {
    if (!fechaStr) return 'Sin fecha';

    try {
      // Asegurarse de convertir a Date si es string
      const fecha = fechaStr instanceof Date ? fechaStr : new Date(fechaStr);

      // Si la fecha es inválida
      if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
      }

      // Añadir 1 hora
      const fechaAjustada = new Date(fecha.getTime() + (1 * 60 * 60 * 1000));

      // Usa el DatePipe para formatear
      const formateado = this.datePipe.transform(fechaAjustada, 'dd/MM/yyyy HH:mm');
      return formateado || 'Formato inválido';
    } catch (e) {
      console.error('Error al formatear fecha:', e, fechaStr);
      return 'Error de formato';
    }
  }

  borrarReserva(id: number): void {
    if (confirm('¿Estás seguro de que deseas borrar esta reserva?')) {
      this.apiService.deleteReserva(id).subscribe({
        next: (response) => {
          console.log('Reserva eliminada:', response);
          alert('Reserva eliminada con éxito');
          this.reservasCombinadas = this.reservasCombinadas.filter(reserva => reserva.id !== id);
          this.filtrarReservas(); // Actualizar la vista después de borrar
        },
        error: (error) => console.error('Error al borrar la reserva:', error)
      });
    }
  }

  // Nuevos métodos para paginación y filtrado
  filtrarReservas(): void {
    const texto = this.filtroTexto?.toLowerCase().trim() || '';

    if (!texto) {
      this.reservasFiltradas = [...this.reservasCombinadas];
    } else {
      this.reservasFiltradas = this.reservasCombinadas.filter(reserva => {
        const fechaFormateada = this.formatearFechaConAjuste(reserva.hora);
        return (
          (reserva.nombreUsuario?.toLowerCase().includes(texto) ?? false) ||
          (reserva.nombreClase?.toLowerCase().includes(texto) ?? false) ||
          (reserva.nombreEntrenador?.toLowerCase().includes(texto) ?? false) ||
          (fechaFormateada?.toLowerCase().includes(texto) ?? false)
        );
      });
    }

    // Actualizar información de paginación
    this.totalPaginas = Math.max(1, Math.ceil(this.reservasFiltradas.length / this.itemsPorPagina));

    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = 1;
    }

    this.actualizarReservasPaginadas();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarReservasPaginadas();
    }
  }

  cambiarItemsPorPagina(items: number): void {
    this.itemsPorPagina = items;
    this.paginaActual = 1; // Reset a primera página
    this.filtrarReservas(); // Recalcula el número de páginas y actualiza los datos paginados
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

  private actualizarReservasPaginadas(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;

    this.reservasPaginadas = this.reservasFiltradas.slice(inicio, fin);
  }
}