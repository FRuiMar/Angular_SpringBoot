import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clases-create',
  templateUrl: './clases-create.component.html',
  styleUrls: ['./clases-create.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Importa FormsModule para usar ngModel
})
export class ClasesCreateComponent implements OnInit {
  nuevaClase: any = {
    nombre: '',
    horario: new Date().toISOString().slice(0, 16), // Fecha y hora actual
    entrenadores: '',
    capacidad_maxima: 0,
    imagen: ''
  };

  entrenadores: any[] = []; // Lista de entrenadores

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.cargarEntrenadores();
  }

  cargarEntrenadores(): void {
    this.apiService.getEntrenadores().subscribe({
      next: (data) => this.entrenadores = data,
      error: (error) => console.error('Error al cargar entrenadores:', error)
    });
  }

  onSubmit(): void {
    // Formatear la fecha al formato ISO 8601
    this.nuevaClase.horario = new Date(this.nuevaClase.horario).toISOString();

    // Si el campo "imagen" no está definido, asígnalo como null o cadena vacía
    if (!this.nuevaClase.imagen) {
      this.nuevaClase.imagen = null; // O una cadena vacía ''
    }

    //console.log('CLASES Datos a enviar:', this.nuevaClase); // Depuración

    this.apiService.createClaseEntreno(this.nuevaClase).subscribe({
      next: () => {
        alert('Actividad creada con éxito');
        this.router.navigate(['/clases/list']);
      },
      error: (error) => console.error('Error al crear la actividad:', error)
    });
  }


  // Asegúrate de añadir este método si no existe
  cancelar(): void {
    this.router.navigate(['/clases/list']);  // Ajusta la ruta según tu estructura
  }
}