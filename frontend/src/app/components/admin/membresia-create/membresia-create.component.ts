import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-membresia-create',
  templateUrl: './membresia-create.component.html',
  styleUrls: ['./membresia-create.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MembresiaCreateComponent implements OnInit {
  membresiaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.membresiaForm = this.fb.group({
      tipo: ['', Validators.required],
      duracionMeses: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
  }

  get tipo() { return this.membresiaForm.get('tipo'); }
  get duracionMeses() { return this.membresiaForm.get('duracionMeses'); }
  get precio() { return this.membresiaForm.get('precio'); }

  onSubmit(): void {
    if (this.membresiaForm.valid) {
      const membresiaNueva = {
        tipo: this.membresiaForm.value.tipo,
        precio: this.membresiaForm.value.precio,
        duracionMeses: this.membresiaForm.value.duracionMeses
      };

      this.apiService.createMembresia(membresiaNueva).subscribe({
        next: (response) => {
          console.log('Membresía creada:', response);
          this.router.navigate(['/membresias']);
        },
        error: (error) => {
          console.error('Error al crear la membresía:', error);
          alert('Error al crear la membresía');
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/membresias']);
  }
}