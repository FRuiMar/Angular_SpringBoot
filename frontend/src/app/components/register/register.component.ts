import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registroForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
    });

    // Aplicar el validador de contraseñas después de la inicialización
    this.registroForm.setValidators(this.passwordsMatchValidator);
  }

  // Validación para que las contraseñas coincidan
  passwordsMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatching: true };
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.mensaje = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const usuarioData = { ...this.registroForm.value, rol: 'usuario' };

    console.log("Enviando datos:", usuarioData); // <-- Agregado para depuración

    // this.apiService.registrarUsuario(usuarioData).subscribe({
    //   next: (response) => {
    //     console.log('Usuario registrado con éxito:', response);
    //     this.mensaje = 'Registro exitoso. Redirigiendo al login...';
    //     setTimeout(() => this.router.navigate(['/login']), 2000);
    //   },
    //   error: (error) => {
    //     console.error('Error en el registro:', error);
    //     this.mensaje = error.error?.error || 'Error al registrar el usuario.';
    //   },
    // });
  }
}
