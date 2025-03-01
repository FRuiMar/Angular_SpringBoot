import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-entrenador-create',
  templateUrl: './entrenador-create.component.html',
  styleUrls: ['./entrenador-create.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EntrenadorCreateComponent {
  entrenador: any = {
    dni: '',
    nombre: '',
    apellido: '',
    especialidad: '',
    imagen: ''
  };

  constructor(private apiService: ApiService, private router: Router) { }

  onSubmit(): void {
    this.apiService.createEntrenador(this.entrenador).subscribe({
      next: () => {
        alert('Entrenador creado con éxito');
        this.router.navigate(['/entrenadores']); // Redirigir a la lista de entrenadores
      },
      error: (error) => console.error('Error al crear el entrenador:', error)
    });
  }

  cancelar(): void {
    this.router.navigate(['/entrenadores']);
  }
}
