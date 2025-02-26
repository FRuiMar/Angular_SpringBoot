import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    const credentials = this.loginForm.value;

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        if (response.result === 'ok') {
          this.router.navigate(['/']); // Navega sin necesidad de recargar
        } else {
          this.errorMessage = response.msg || 'Error en el inicio de sesión.';
        }
      },
      error: () => {
        this.errorMessage = 'Error al conectar con el servidor.';
      },
    });
  }

  // getUserData(): void {
  //   this.apiService.getAuthenticatedUser().subscribe({
  //     next: (response) => {
  //       if (response.result === 'ok') {
  //         this.apiService.saveUserData(localStorage.getItem('jwt')!, response);
  //         this.router.navigate(['/']);
  //       } else {
  //         this.errorMessage = 'Error al obtener los datos del usuario22.';
  //       }
  //     },
  //     error: () => {
  //       this.errorMessage = 'Error al obtener los datos del usuario.';
  //     },
  //   });
  // }


}
