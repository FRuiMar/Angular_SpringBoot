import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrenador-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrenador-edit.component.html',
  styleUrl: './entrenador-edit.component.css'
})
export class EntrenadorEditComponent {
  entrenador: any = {
    id: 0,
    dni: '',
    nombre: '',
    apellido: '',
    especialidad: '',
    imagen: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.cargarEntrenador(id);
  }

  cargarEntrenador(id: number): void {
    this.apiService.getEntrenadorById(id).subscribe({
      next: (data) => {
        this.entrenador = { ...data };
      },
      error: (error) => console.error('Error al cargar el entrenador:', error)
    });
  }

  onSubmit(): void {
    // Asegurar que la imagen no sea undefined
    if (!this.entrenador.imagen) {
      this.entrenador.imagen = null;
    }

    // Crear un objeto con los nombres correctos para la API
    const entrenadorAEnviar = {
      id: this.entrenador.id,
      dni: this.entrenador.dni,
      nombre: this.entrenador.nombre,
      apellido: this.entrenador.apellido,
      especialidad: this.entrenador.especialidad,
      imagen: this.entrenador.imagen
    };

    this.apiService.updateEntrenadorPorId(entrenadorAEnviar).subscribe({
      next: () => {
        alert('Entrenador actualizado con éxito');
        this.router.navigate(['/entrenadores']);
      },
      error: (error) => console.error('Error al actualizar el entrenador:', error)
    });
  }

  cancelar(): void {
    this.router.navigate(['/entrenadores']);
  }

}


