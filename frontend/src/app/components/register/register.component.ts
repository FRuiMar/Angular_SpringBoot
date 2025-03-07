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

  // Nuevas propiedades para manejar imágenes
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;

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

  // Método para manejar la selección de archivos
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar el tamaño del archivo (opcional)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.mensaje = 'La imagen es demasiado grande. Máximo 5MB.';
        return;
      }

      this.imagenSeleccionada = file;

      // Crear una vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.mensaje = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    // Crear FormData para enviar datos y archivo
    const formData = new FormData();

    // Datos del usuario
    const usuarioData = {
      dni: this.registroForm.value.dni,
      nombre: this.registroForm.value.nombre,
      apellido: this.registroForm.value.apellido,
      email: this.registroForm.value.email,
      pass: this.registroForm.value.password,
      rol: 'NORMAL', // Rol por defecto para usuarios registrados
      membresia: this.registroForm.value.membresia,
    };

    // Guardar las credenciales para hacer login después
    const credentials = {
      email: usuarioData.email,
      pass: usuarioData.pass
    };

    // Añadir los datos del usuario como un blob JSON
    formData.append('datos', new Blob([JSON.stringify(usuarioData)], {
      type: 'application/json'
    }));

    // Añadir la imagen si se ha seleccionado una
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    console.log("Enviando formulario con imagen:", this.imagenSeleccionada ? 'Sí' : 'No');


    // Mostrar mensaje de carga
    this.mensaje = 'Registrando usuario, por favor espere...';

    // Enviar al servidor usando el mismo endpoint que para crear usuarios
    this.apiService.registrarUsuario(formData).subscribe({
      next: (response) => {
        if (response.result === 'ok') {
          console.log('Usuario registrado con éxito:', response);

          // Mostrar mensaje de éxito y esperar un momento
          this.mensaje = `¡Registro exitoso! Bienvenido/a ${usuarioData.nombre}. Iniciando sesión...`;

          // Agregar un retraso para que el usuario pueda ver el mensaje
          setTimeout(() => {
            this.mensaje = 'Iniciando sesión automáticamente...';

            // Realizar login automático después de un pequeño retraso
            setTimeout(() => {
              this.realizarLoginAutomatico(credentials);
            }, 2000);
          }, 3000);
        } else {
          this.mensaje = response.message || 'Error al registrar el usuario.';
        }
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.mensaje = error.error?.message || 'Error al conectar con el servidor.';
      },
    });
  }

  // Método para realizar el login automáticamente
  realizarLoginAutomatico(credentials: { email: string, pass: string }): void {
    this.apiService.login(credentials).subscribe({
      next: (response) => {
        if (response.result === 'ok') {
          // Usar el observable user$ como en tu LoginComponent
          this.apiService.user$.subscribe(user => {
            if (user) {
              this.router.navigate(['/']);
            }
          });
        } else {
          console.error('Error en el inicio de sesión automático:', response.msg);
          this.mensaje = 'Registro exitoso. Por favor, inicia sesión manualmente.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (error) => {
        console.error('Error en el inicio de sesión automático:', error);
        this.mensaje = 'Registro exitoso. Por favor, inicia sesión manualmente.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    });
  }

  // CORREGIDO: Ahora está usando imagenSeleccionada en lugar de selectedImage
  removeSelectedImage(): void {
    this.imagenPreview = null;
    this.imagenSeleccionada = null; // Usando la propiedad correcta

    // Esto reinicia el campo de archivo para que el usuario pueda seleccionar el mismo archivo nuevamente
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}