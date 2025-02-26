import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clases-gym',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './clases-gym.component.html',
  styleUrls: ['./clases-gym.component.css'],
})
export class ClasesGymComponent implements OnInit {
  clases: any[] = []; // Array para almacenar las clases de gimnasio

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerClases(); // Llama al método para obtener las clases al inicializar el componente
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
    clase.flipped = !clase.flipped;
  }
}