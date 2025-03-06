import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reservas-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservas-usuario.component.html',
  styleUrl: './reservas-usuario.component.css'
})
export class ReservasUsuarioComponent implements OnInit {
  reservas: any[] = [];
  clases: any[] = [];
  entrenadores: any[] = []; // Añadimos array de entrenadores
  reservasCombinadas: any[] = [];
  usuario: any = null;
  cargando: boolean = true;
  error: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Suscribirse al usuario actual desde el servicio
    this.apiService.user$.subscribe({
      next: (user) => {
        console.log('Usuario obtenido en ReservasUsuario:', user);
        if (user) {
          this.usuario = user;
          this.obtenerReservasDelUsuario(user.id);
          this.obtenerClases();
          this.obtenerEntrenadores(); // Obtenemos también los entrenadores
        } else {
          this.error = 'No hay usuario autenticado';
          this.cargando = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
        this.error = 'Error al obtener la información del usuario';
        this.cargando = false;
      }
    });
  }

  obtenerReservasDelUsuario(userId: any): void {
    console.log('Obteniendo reservas para usuario con ID:', userId);
    this.apiService.getReservasPorUsuario(userId.toString()).subscribe({
      next: (data) => {
        console.log('Reservas recibidas del backend:', data);
        if (data && data.length > 0) {
          console.log('Estructura de una reserva:', data[0]);
        }
        this.reservas = data;
        this.combinarDatos();
      },
      error: (err) => {
        console.error('Error al obtener las reservas del usuario:', err);
        this.error = 'Error al cargar tus reservas';
        this.cargando = false;
      }
    });
  }

  obtenerClases(): void {
    this.apiService.getClasesEntreno().subscribe({
      next: (data) => {
        console.log('Clases recibidas:', data);
        if (data && data.length > 0) {
          console.log('Estructura de una clase:', data[0]);
        }
        this.clases = data;
        this.combinarDatos();
      },
      error: (err) => {
        console.error('Error al obtener las clases:', err);
        this.error = 'Error al cargar información de clases';
        this.cargando = false;
      }
    });
  }

  obtenerEntrenadores(): void {
    this.apiService.getEntrenadores().subscribe({
      next: (data) => {
        console.log('Entrenadores recibidos:', data);
        if (data && data.length > 0) {
          console.log('Estructura de un entrenador:', data[0]);
        }
        this.entrenadores = data;
        this.combinarDatos();
      },
      error: (err) => {
        console.error('Error al obtener los entrenadores:', err);
        // Esto no es crítico, podemos continuar sin los nombres de entrenadores
        this.combinarDatos();
      }
    });
  }

  combinarDatos(): void {
    // Solo combinar cuando tenemos reservas y clases (los entrenadores son opcionales)
    if (this.reservas.length > 0 && this.clases.length > 0) {
      console.log('Combinando datos...');

      this.reservasCombinadas = this.reservas.map(reserva => {
        // Buscar la información de la clase correspondiente a esta reserva
        const clase = this.clases.find(c => c.id === reserva.claseId);
        console.log('Para reserva ID:', reserva.id, 'encontrada clase:', clase ? clase.id : 'no encontrada');

        let nombreEntrenador = 'Sin asignar';
        let horarioClase = 'No especificado';

        // Si tenemos la clase, extraer su horario
        if (clase) {
          // El horario de la clase (puede estar en diferentes propiedades según el backend)
          horarioClase = clase.horario || clase.hora || 'No especificado';
        }

        // Buscar el entrenador (sin cambios)
        if (clase && clase.entrenadorId && this.entrenadores.length > 0) {
          const entrenador = this.entrenadores.find(e => e.id === clase.entrenadorId);
          if (entrenador) {
            nombreEntrenador = entrenador.nombre || 'Nombre no disponible';
          }
        } else if (clase && clase.entrenadores) {
          nombreEntrenador = clase.entrenadores.nombre || 'Nombre no disponible';
        } else if (clase && clase.entrenador && typeof clase.entrenador === 'string') {
          nombreEntrenador = clase.entrenador;
        }

        return {
          id: reserva.id,
          nombreUsuario: this.usuario?.nombre || 'Usuario',
          nombreClase: clase ? clase.nombre : 'Clase no encontrada',
          horarioClase: horarioClase, // Horario de la clase (cuándo se imparte)
          hora: reserva.fechaReserva, // Fecha en que se hizo la reserva
          nombreEntrenador: nombreEntrenador
        };
      });

      console.log('Datos combinados finales:', this.reservasCombinadas);
      this.cargando = false;
    } else if (this.reservas.length === 0 && this.clases.length > 0) {
      console.log('No hay reservas para mostrar');
      this.cargando = false;
    }
  }

  borrarReserva(id: number): void {
    if (confirm('¿Estás seguro de que deseas borrar esta reserva?')) {
      this.apiService.deleteReserva(id).subscribe({
        next: (response) => {
          console.log('Respuesta al borrar reserva:', response);
          alert('Reserva eliminada con éxito');
          this.reservasCombinadas = this.reservasCombinadas.filter(reserva => reserva.id !== id);
        },
        error: (err) => {
          console.error('Error al borrar la reserva:', err);
          alert('Error al eliminar la reserva');
        }
      });
    }
  }
}