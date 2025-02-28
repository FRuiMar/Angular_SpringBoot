import { Component, OnInit } from '@angular/core';
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
export class RegisterComponent implements OnInit {
  registroForm: FormGroup;
  mensaje: string = '';
  membresias: any[] = []; // Lista de membresías

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registroForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
      membresia: ['', [Validators.required]],
    });

    // Aplicar el validador de contraseñas después de la inicialización
    this.registroForm.setValidators(this.passwordsMatchValidator);
  }

  ngOnInit(): void {
    this.cargarMembresias();
  }

  // Cargar las membresías desde el backend
  cargarMembresias(): void {
    this.apiService.getMembresias().subscribe({
      next: (data) => {
        this.membresias = data;
      },
      error: (error) => {
        console.error('Error al cargar las membresías:', error);
      },
    });
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

    const usuarioData = {
      dni: this.registroForm.value.dni,
      nombre: this.registroForm.value.nombre,
      apellido: this.registroForm.value.apellido,
      email: this.registroForm.value.email,
      pass: this.registroForm.value.password,
      rol: 'NORMAL', // Use a valid enum value
      imagen: '', // Imagen por defecto (puedes cambiarlo)
      membresia: this.registroForm.value.membresia,
    };

    console.log("Enviando datos:", usuarioData);

    this.apiService.createUsuario(usuarioData).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito:', response);
        this.mensaje = 'Registro exitoso. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.mensaje = error.error?.error || 'Error al registrar el usuario.';
      },
    });
  }
}