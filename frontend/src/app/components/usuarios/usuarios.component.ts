import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common'; // Para usar *ngFor

@Component({
  selector: 'app-usuarios',
  standalone: true, // Si estás usando Angular 17+ con componentes independientes
  imports: [CommonModule], // Importar CommonModule para *ngFor
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = []; // Array para almacenar los usuarios

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.obtenerUsuarios(); // Llama al método para obtener usuarios al inicializar el componente
  }

  obtenerUsuarios(): void {
    this.apiService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data; // Asigna los usuarios obtenidos a la propiedad 'usuarios'
      },
      (error) => {
        console.error('Error al obtener usuarios', error); // Manejo de errores
      }
    );
  }
}