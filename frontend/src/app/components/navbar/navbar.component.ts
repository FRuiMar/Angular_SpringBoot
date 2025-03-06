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

    this.apiService.initializeUser();

    // Suscripción al observable de usuario (esto permanece igual)
    this.apiService.user$.subscribe(user => {
      console.log('Usuario logueado:', user);
      console.log('Rol del usuario:', user?.rol);
      this.user = user;
      this.isAuthenticated = !!user;
      this.isAdmin = user && user.rol && user.rol.toLowerCase() === 'admin';
    });

  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/']);
  }
}
