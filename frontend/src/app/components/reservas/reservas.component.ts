import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  providers: [DatePipe]
})
export class ReservasComponent implements OnInit {
  reservas: any[] = [];
  usuarios: any[] = [];
  clases: any[] = [];
  reservasCombinadas: any[] = [];

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
        },
        error: (error) => console.error('Error al borrar la reserva:', error)
      });
    }
  }
}