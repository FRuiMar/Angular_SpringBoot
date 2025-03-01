import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importa Router y sus directivas
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.user$.subscribe(user => {
      console.log('Usuario logueado:', user); // Verificar que se está recibiendo el usuario
      console.log('Rol del usuario:', user?.rol); // Verificar el rol del usuario
      this.user = user;
      this.isAuthenticated = !!user;
      this.isAdmin = user?.rol.toLowerCase() === 'admin';
    });

    // Verifica que se obtenga el usuario autenticado al inicializar
    this.apiService.getAuthenticatedUser().subscribe({
      next: (user) => {
        console.log('Usuario autenticado inicial:', user);
      },
      error: (error) => {
        console.error('Error al obtener el usuario autenticado:', error);
      }
    });
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
