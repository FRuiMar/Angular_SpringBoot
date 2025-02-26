import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common'; // Para usar *ngFor
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-entrenadores',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './entrenadores.component.html',
  styleUrl: './entrenadores.component.css'
})

export class EntrenadoresComponent implements OnInit {
  entrenadores: any[] = []; // Array para almacenar los entrenadores
  columnas: string[] = ['id', 'nombre', 'email', 'especialidad', 'experiencia']; // Columnas de la tabla

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginador
  @ViewChild(MatSort) sort!: MatSort; // Ordenación

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
