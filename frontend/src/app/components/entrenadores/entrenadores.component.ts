import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common'; // Para usar *ngFor

@Component({
  selector: 'app-entrenadores',
  standalone: true,
  imports: [
    CommonModule, // Necesario para *ngFor
  ],
  templateUrl: './entrenadores.component.html',
  styleUrl: './entrenadores.component.css'
})
export class EntrenadoresComponent implements OnInit {
  entrenadores: any[] = []; // Array para almacenar los entrenadores

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerEntrenadores(); // Llama al método para obtener entrenadores al inicializar el componente
  }

  obtenerEntrenadores(): void {
    this.apiService.getEntrenadores().subscribe(
      (data) => {
        this.entrenadores = data; // Asigna los entrenadores obtenidos a la propiedad 'entrenadores'
      },
      (error) => {
        console.error('Error al obtener entrenadores', error); // Manejo de errores
      }
    );
  }
}