import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.css'],
})
export class UsuarioCreateComponent implements OnInit {
  registroForm: FormGroup;
  mensaje: string = '';
  membresias: any[] = []; // Lista de membresías
  roles: string[] = ['NORMAL', 'ADMIN']; // Lista de roles disponibles
  selectedImage: File | null = null; // Imagen seleccionada
  imagePreview: string | null = null; // Vista previa de la imagen

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    // Inicializar el formulario
    this.registroForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]],
      membresia: ['', [Validators.required]],
      rol: ['NORMAL', [Validators.required]], // Rol por defecto
    },
      { validators: this.passwordsMatchValidator }); // Aplicamos el validador al grupo completo
  }

  ngOnInit(): void {
    this.cargarMembresias();
  }

  // Cargar las membresías desde el backend
  cargarMembresias(): void {
    this.apiService.getMembresias().subscribe({
      next: (data) => {
        console.log('Membresías cargadas:', data);
        this.membresias = data;
      },
      error: (error) => {
        console.error('Error al cargar las membresías:', error);
        this.mensaje = 'Error al cargar membresías. Intente nuevamente.';
      },
    });
  }

  // Validación para que las contraseñas coincidan
  passwordsMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    // Solo validar si ambos campos tienen valor
    if (password && confirmPassword) {
      return password === confirmPassword ? null : { passwordsNotMatching: true };
    }
    return null;
  }

  // Método para manejar la selección de imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      this.mensaje = 'Por favor, seleccione un archivo de imagen válido.';
    }
  }

  // Método para eliminar la imagen seleccionada
  removeSelectedImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  onSubmit() {
    console.log('Formulario enviado con estado:', this.registroForm.status);
    console.log('Valores del formulario:', this.registroForm.value);

    if (this.registroForm.invalid) {
      console.log('Formulario inválido. Errores:', this.registroForm.errors);
      this.mensaje = 'Por favor, completa todos los campos correctamente.';
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const usuarioData = {
      dni: this.registroForm.value.dni,
      nombre: this.registroForm.value.nombre,
      apellido: this.registroForm.value.apellido,
      email: this.registroForm.value.email,
      pass: this.registroForm.value.password,
      rol: this.registroForm.value.rol,
      imagen: '', // Este campo se maneja a través del archivo
      membresia: this.registroForm.value.membresia,
    };

    console.log("Enviando datos del nuevo usuario:", usuarioData);
    console.log("Imagen seleccionada:", this.selectedImage ? this.selectedImage.name : "Ninguna");

    // Usar el método de crear usuario con imagen
    this.apiService.createUsuarioConImagen(usuarioData, this.selectedImage).subscribe({
      next: (response) => {
        console.log('Usuario creado con éxito:', response);
        this.mensaje = 'Usuario creado exitosamente.';
        // Después de un tiempo, redirigir a la lista de usuarios
        setTimeout(() => this.router.navigate(['/usuarios']), 2000);
      },
      error: (error) => {
        console.error('Error al crear el usuario:', error);
        this.mensaje = error.error?.message || 'Error al crear el usuario.';
      },
    });
  }


  // Asegúrate de añadir este método si no existe
  cancelar(): void {
    this.router.navigate(['/usuarios']);  // Ajusta la ruta según tu estructura
  }
}