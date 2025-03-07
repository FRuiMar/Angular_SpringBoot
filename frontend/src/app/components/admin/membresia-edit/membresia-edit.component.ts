import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-membresia-edit',
  templateUrl: './membresia-edit.component.html',
  styleUrls: ['./membresia-edit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MembresiaEditComponent implements OnInit {
  membresiaForm: FormGroup;
  membresiaId: number = 0;
  cargando: boolean = true;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.membresiaForm = this.fb.group({
      id: ['', Validators.required],
      tipo: ['', Validators.required],
      duracionMeses: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.membresiaId = +params['id'];
      this.cargarDatosMembresia();
    });
  }

  cargarDatosMembresia(): void {
    this.cargando = true;
    this.apiService.getMembresiaById(this.membresiaId).subscribe({
      next: (data) => {
        console.log('Datos de membresía recibidos:', data);
        this.membresiaForm.patchValue({
          id: data.id,
          tipo: data.tipo,
          duracionMeses: data.duracion_meses,
          precio: data.precio
        });
        this.cargando = false;
        this.membresiaForm.markAsPristine(); // Marcar como no modificado inicialmente
      },
      error: (error) => {
        console.error('Error al cargar la membresía:', error);
        alert('Error al cargar los datos de la membresía');
        this.cargando = false;
      }
    });
  }

  get tipo() { return this.membresiaForm.get('tipo'); }
  get duracionMeses() { return this.membresiaForm.get('duracionMeses'); }
  get precio() { return this.membresiaForm.get('precio'); }

  onSubmit(): void {
    if (this.membresiaForm.valid && this.membresiaForm.dirty) {
      const membresiaActualizada = {
        id: this.membresiaForm.value.id,
        tipo: this.membresiaForm.value.tipo,
        precio: this.membresiaForm.value.precio,
        duracionMeses: this.membresiaForm.value.duracionMeses
      };

      this.apiService.updateMembresia(membresiaActualizada).subscribe({
        next: (response) => {
          console.log('Membresía actualizada:', response);
          this.router.navigate(['/membresias']);
        },
        error: (error) => {
          console.error('Error al actualizar la membresía:', error);
          alert('Error al actualizar la membresía');
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/membresias']);
  }
}