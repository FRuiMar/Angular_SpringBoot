import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clases-edit',
  templateUrl: './clases-edit.component.html',
  styleUrls: ['./clases-edit.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Importa FormsModule para usar ngModel
})
export class ClasesEditComponent implements OnInit {
  clase: any = {
    id: 0,
    nombre: '',
    horario: '',
    entrenador: '',
    capacidad_maxima: 0,
  };

  entrenadores: any[] = []; // Lista de entrenadores

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    // Primero cargamos entrenadores y luego la clase
    this.cargarEntrenadores().then(() => {
      this.cargarClase(id);
    }).catch(error => {
      console.error('Error al cargar entrenadores:', error);
    });
  }

  cargarClase(id: number): void {
    this.apiService.getClaseEntrenoById(id).subscribe({
      next: (data) => {
        // Buscar el ID del entrenador basado en el nombre que devuelve el backend
        const entrenadorEncontrado = this.entrenadores.find(e => e.nombre === data.entrenador);

        this.clase = {
          ...data,
          entrenadores: entrenadorEncontrado ? entrenadorEncontrado.id : null // Aseguramos un valor válido
        };
      },
      error: (error) => console.error('Error al cargar la clase:', error)
    });
  }

  cargarEntrenadores(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getEntrenadores().subscribe({
        next: (data) => {
          this.entrenadores = data;
          resolve(); // Resolvemos la promesa cuando los datos se han cargado
        },
        error: (error) => {
          console.error('Error al cargar entrenadores:', error);
          reject(error); // Rechazamos la promesa si hay un error
        }
      });
    });
  }

  onSubmit(): void {
    // Añadir formato de fecha
    this.clase.horario = new Date(this.clase.horario).toISOString();

    // Asegurar que imagen no sea undefined
    if (!this.clase.imagen) {
      this.clase.imagen = null;
    }

    // Crear un objeto con los nombres correctos para la API
    const claseAEnviar = {
      id: this.clase.id,
      nombre: this.clase.nombre,
      horario: this.clase.horario,
      entrenadores: this.clase.entrenadores, // ID del entrenador
      capacidadMaxima: this.clase.capacidad_maxima, // Cambio aquí para coincidir con el backend
      imagen: this.clase.imagen
    };

    this.apiService.updateClaseEntreno(claseAEnviar).subscribe({
      next: () => {
        alert('Actividad actualizada con éxito');
        this.router.navigate(['/clases/list']);
      },
      error: (error) => console.error('Error al actualizar la actividad:', error)
    });
  }


  cancelar(): void {
    this.router.navigate(['/clases/list']);
  }
}