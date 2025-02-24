import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-navbar',
  standalone: true, // Marca el componente como independiente
  imports: [CommonModule, RouterModule], // Importa los módulos necesarios
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn = false; // Define el estado inicial
}

