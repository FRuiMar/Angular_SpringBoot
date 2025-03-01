import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent implements OnInit {
  reservas: any[] = []; // Array para almacenar las reservas
  usuarios: any[] = []; // Array para almacenar los usuarios
  clases: any[] = []; // Array para almacenar las clases
  reservasCombinadas: any[] = []; // Array para almacenar los datos combinados

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerReservas();
    this.obtenerUsuarios();
    this.obtenerClases();
  }

  // Obtener las reservas
  obtenerReservas(): void {
    this.apiService.getReservas().subscribe(
      (data) => {
        this.reservas = data;
        this.combinarDatos(); // Combinar datos después de obtener las reservas
      },
      (error) => {
        console.error('Error al obtener las reservas', error);
      }
    );
  }

  // Obtener los usuarios
  obtenerUsuarios(): void {
    this.apiService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.combinarDatos(); // Combinar datos después de obtener los usuarios
      },
      (error) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

  // Obtener las clases
  obtenerClases(): void {
    this.apiService.getClasesEntreno().subscribe(
      (data) => {
        this.clases = data;
        this.combinarDatos(); // Combinar datos después de obtener las clases
      },
      (error) => {
        console.error('Error al obtener las clases', error);
      }
    );
  }

  // Combinar los datos de reservas, usuarios y clases
  combinarDatos(): void {
    if (this.reservas.length > 0 && this.usuarios.length > 0 && this.clases.length > 0) {
      this.reservasCombinadas = this.reservas.map((reserva) => {
        const usuario = this.usuarios.find((u) => u.id === reserva.usuarioId);
        const clase = this.clases.find((c) => c.id === reserva.claseId);
        return {
          id: reserva.id,
          nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido',
          nombreClase: clase ? clase.nombre : 'Desconocido',
          hora: reserva.fecha, // Suponiendo que la fecha incluye la hora
          nombreEntrenador: clase ? clase.entrenador : 'Desconocido',
        };
      });
    }
  }

  borrarReserva(id: number): void {
    if (confirm('¿Estás seguro de que deseas borrar esta reserva?')) {
      this.apiService.deleteReserva(id).subscribe({
        next: () => {
          alert('Reserva eliminada con éxito');
          this.reservasCombinadas = this.reservasCombinadas.filter(reserva => reserva.id !== id);
        },
        error: (error) => console.error('Error al borrar la reserva:', error)
      });
    }
  }

}