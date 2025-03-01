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
    if (!this.user) {
      // Si no está logueado, redirige al login
      this.router.navigate(['/login']);
    } else {
      // Si está logueado, crea la reserva
      const reserva = {
        usuarioId: this.user.id, // ID del usuario logueado
        claseEntrenoId: claseEntrenoId, // ID de la clase de entrenamiento
        fechaReserva: new Date().toISOString(), // Fecha actual en formato ISO 8601
      };

      this.apiService.createReserva(reserva).subscribe(
        (response) => {
          console.log('Reserva creada:', response);
          alert('Reserva creada con éxito'); // Feedback al usuario
        },

        (error) => {
          console.error('Error al crear la reserva:', error);
          alert('Error al crear la reserva'); // Feedback al usuario
        }
      );
    }
  }
}