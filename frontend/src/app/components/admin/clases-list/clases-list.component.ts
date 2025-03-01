import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clases-list',
  templateUrl: './clases-list.component.html',
  styleUrls: ['./clases-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ClasesListComponent implements OnInit {
  clases: any[] = []; // Array para almacenar las clases de gimnasio

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerClases(); // Llama al método para obtener las clases al inicializar el componente
  }

  obtenerClases(): void {
    this.apiService.getClasesEntreno().subscribe({

      next: (data) => {
        console.log(data); // Verifica la estructura de los datos
        this.clases = data;
      },
      error: (error) => console.error('Error al obtener las clases:', error)
    });
  }

  abrirFormulario(): void {
    this.router.navigate(['/clases/create']);
  }

  abrirModalEditar(clase: any): void {
    this.router.navigate(['/clases/edit', clase.id]);
  }

  borrarClase(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar esta clase?')) {
      this.apiService.deleteClaseEntreno(id).subscribe({
        next: () => this.obtenerClases(),
        error: (error) => console.error('Error al borrar la clase:', error)
      });
    }
  }
}