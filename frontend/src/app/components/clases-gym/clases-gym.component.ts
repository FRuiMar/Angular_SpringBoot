import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clases-gym',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clases-gym.component.html',
  styleUrls: ['./clases-gym.component.css'],
})
export class ClasesGymComponent implements OnInit {
  clases: any[] = []; // Array para almacenar las clases de gimnasio
  flippedCardId: number | null = null; // Variable para almacenar el ID de la tarjeta girada
  user: any = null; // Usuario logueado

  constructor(
    private apiService: ApiService,
    private router: Router // Para redirecciones
  ) { }

  ngOnInit(): void {
    this.obtenerClases(); // Llama al método para obtener las clases al inicializar el componente

    // Suscripción al usuario logueado
    this.apiService.user$.subscribe((user) => {
      this.user = user; // Actualiza el usuario logueado
    });
  }

  obtenerClases(): void {
    this.apiService.getClasesEntreno().subscribe(
      (data) => {
        this.clases = data.map((clase: any) => ({ ...clase, flipped: false })); // Añade la propiedad 'flipped'
      },
      (error) => {
        console.error('Error al obtener las clases', error); // Manejo de errores
      }
    );
  }

  // Método para girar la card
  toggleFlip(clase: any): void {
    if (this.flippedCardId !== null && this.flippedCardId !== clase.id) {
      // Restablece la tarjeta anteriormente girada
      const previousFlippedClase = this.clases.find((c) => c.id === this.flippedCardId);
      if (previousFlippedClase) {
        previousFlippedClase.flipped = false;
      }
    }

    // Gira o des-gira la tarjeta actual
    clase.flipped = !clase.flipped;
    this.flippedCardId = clase.flipped ? clase.id : null;
  }

  // Método para reservar una clase
  reservarClase(claseEntrenoId: number): void {
    // Detener la propagación del evento click para que no se gire la tarjeta
    event?.stopPropagation();

    if (!this.user) {
      // Si no está logueado, redirige al login
      this.router.navigate(['/login']);
      return;
    }

    console.log('Intentando reservar clase:', claseEntrenoId, 'para usuario:', this.user.id);

    // Verificar que tenemos los datos necesarios
    if (!this.user.id || !claseEntrenoId) {
      console.error('Faltan datos necesarios para la reserva');
      alert('Error: Faltan datos necesarios para realizar la reserva');
      return;
    }

    // Si está logueado, crea la reserva con el formato que espera el backend
    const reserva = {
      fechaReserva: new Date(), // El backend espera un objeto Date, no un string
      usuarioId: this.user.id,
      claseEntrenoId: claseEntrenoId
    };

    console.log('Datos de reserva a enviar:', reserva);

    // Llamar al servicio para crear la reserva
    this.apiService.createReserva(reserva).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response && response.result === 'ok') {
          alert('Reserva creada con éxito');
        } else {
          alert('Error al crear la reserva: ' + (response?.message || 'Respuesta desconocida'));
        }
      },
      error: (error) => {
        console.error('Error al crear la reserva:', error);
        alert('Error al crear la reserva. Por favor, inténtalo de nuevo.');
      }
    });
  }
}