import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-usuario.component.html',
  styleUrl: './reservas-usuario.component.css'
})
export class ReservasUsuarioComponent implements OnInit {

  reservas: any[] = [];
  usuarios: any[] = [];
  clases: any[] = [];
  reservasCombinadas: any[] = [];
  usuarioActual: any; // Guardará los datos del usuario logado

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    this.obtenerReservas();
    this.obtenerUsuarios();
    this.obtenerClases();
  }

  obtenerUsuarioActual(): void {
    // Obtener usuario desde el localStorage (ajusta esto si usas otro método)
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioActual = JSON.parse(usuario);
    } else {
      console.warn('No se encontró usuario autenticado.');
    }
  }

  obtenerReservas(): void {
    this.apiService.getReservas().subscribe(
      (data) => {
        // Filtrar solo las reservas del usuario logado
        this.reservas = data.filter(reserva => reserva.usuarioId === this.usuarioActual?.id);
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
      this.reservasCombinadas = this.reservas.map((reserva) => {
        const usuario = this.usuarios.find((u) => u.id === reserva.usuarioId);
        const clase = this.clases.find((c) => c.id === reserva.claseId);
        return {
          id: reserva.id,
          nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido',
          nombreClase: clase ? clase.nombre : 'Desconocido',
          hora: reserva.fecha,
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
