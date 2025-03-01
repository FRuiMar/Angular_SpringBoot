import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entrenadores',
  templateUrl: './entrenadores.component.html',
  styleUrls: ['./entrenadores.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EntrenadoresComponent implements OnInit {
  entrenadores: any[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.cargarEntrenadores();
  }

  cargarEntrenadores(): void {
    this.apiService.getEntrenadores().subscribe({
      next: (data) => {
        this.entrenadores = data;
      },
      error: (error) => {
        console.error('Error al cargar los entrenadores:', error);
      }
    });
  }

  abrirModalCrear(): void {
    this.router.navigate(['/entrenadores/create']);
  }

  abrirModalEditar(entrenador: any): void {
    this.router.navigate(['/entrenadores/edit', entrenador.id]);
  }

  borrarEntrenador(id: number): void {
    if (confirm('¿Estás seguro de que quieres borrar este entrenador?')) {
      this.apiService.deleteEntrenador(id.toString()).subscribe({
        next: () => {
          console.log('Entrenador borrado');
          this.cargarEntrenadores();
        },
        error: (error) => {
          console.error('Error al borrar el entrenador:', error);
        }
      });
    }
  }
}
