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
  selectedFile: File | null = null;




  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registroForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
      membresia: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registroForm.patchValue({
        imagen: file
      });
    }
  }


  // onSubmit() {
  //   if (this.registroForm.invalid) {
  //     this.mensaje = 'Por favor, completa todos los campos correctamente.';
  //     return;
  //   }

  //   const usuarioData = { ...this.registroForm.value, rol: 'usuario' };

  //   console.log("Enviando datos:", usuarioData); // <-- Agregado para depuración

  //   // this.apiService.registrarUsuario(usuarioData).subscribe({
  //   //   next: (response) => {
  //     console.log('Usuario registrado con éxito:', response);
  //     this.mensaje = 'Registro exitoso. Redirigiendo al login...';
  //     setTimeout(() => this.router.navigate(['/login']), 2000);
  //   },
  //   error: (error) => {
  //     console.error('Error en el registro:', error);
  //     this.mensaje = error.error?.error || 'Error al registrar el usuario.';
  //   },
  // });
  // }






  onSubmit(): void {
    // if (this.reviewForm.valid) {
    const formData = new FormData();

    // Append review data as JSON
    formData.append('datosCreacionUsuario', new Blob([JSON.stringify({
      dni: this.registroForm.value.dni,
      nombre: this.registroForm.value.nombre,
      apellido: this.registroForm.value.apellido,
      email: this.registroForm.value.email,
      password: this.registroForm.value.password,
      confirmPassword: this.registroForm.value.confirmPassword,
      membresia: this.registroForm.value.membresia,
    })], { type: 'application/json' }));


    // Append the image file
    // if (this.selectedFile) {
    //   formData.append('imagen', this.selectedFile);
    //   console.log("Image appended:", this.selectedFile.name);
    // } else {
    //   console.warn("No image selected!");
    // }
    const imageFile = this.registroForm.value.imagen;
    if (imageFile) {
      formData.append('imagen', imageFile);
    } else {
      console.warn("No image selected!");
    }



    //Submit the form data
    this.apiService.createUsuario(formData).subscribe(
      (data: any) => {
        console.log("Review submitted successfully!");
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error("Error submitting review:", error);
      }
    );

  }


}
