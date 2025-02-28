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

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],    //si alguna de las dos validacones no es correcta, el  loginForm es invalido, 
      pass: ['', [Validators.required]],        //que es lo que compruebo más abajo con el .invalid en el método login()
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    if (typeof localStorage === 'undefined') {
      this.errorMessage = 'LOGIN - localStorage no está disponible en este entorno.';
      return;
    }
    const credentials = this.loginForm.value;  //si el formulario es válido, se obtienen los valores de los campos

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        if (response.result === 'ok') {
          // Espera a que el estado del usuario se actualice antes de redirigir
          this.apiService.user$.subscribe(user => {
            if (user) {
              this.router.navigate(['/']); // Redirige solo si el usuario está actualizado
            }
          });
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
  //         this.errorMessage = 'Error al obtener los datos del usuario.';
  //       }
  //     },
  //     error: () => {
  //       this.errorMessage = 'Error al obtener los datos del usuario.';
  //     },
  //   });
  // }

  getUserData(): void {
    if (typeof localStorage !== 'undefined') {
      this.apiService.getAuthenticatedUser().subscribe({
        next: (response) => {
          if (response.result === 'ok') {
            this.apiService.saveUserData(localStorage.getItem('jwt')!, response);
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Error al obtener los datos del usuario.';
          }
        },
        error: () => {
          this.errorMessage = 'Error al obtener los datos del usuario.';
        },
      });
    } else {
      console.warn('localStorage no está disponible en este entorno.');
    }
  }

}
