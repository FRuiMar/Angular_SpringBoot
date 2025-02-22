import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout() {
    this.authService.logout();
  }
}
  
