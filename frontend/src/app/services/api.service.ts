import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // URL de tu backend

  constructor(private http: HttpClient) { }

  // Métodos para Usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuario/obtener`);
  }

  getUsuarioById(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuario/obtenerPorId`, { id });
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuario/addUsuario`, usuario);
  }

  updateUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/editUsuarioPorId`, usuario);
  }

  deleteUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuario/deleteUsuarioPorId`, { body: { id } });
  }



  // Métodos para Entrenadores
  getEntrenadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/entrenador/obtener`);
  }
  getEntrenadorById(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/entrenador/obtener1`, { id });
  }

  createEntrenador(entrenador: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/entrenador/addentrenador`, entrenador);
  }

  updateEntrenadorPorDni(entrenador: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/entrenador/editEntrenadorPorDni`, entrenador);
  }

  updateEntrenadorPorId(entrenador: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/entrenador/editEntrenadorPorId`, entrenador);
  }

  deleteEntrenador(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/entrenador/borrarEntrenadorPorId`, { body: { id } });
  }


  // Métodos para Clase-Gym
  getClasesEntreno(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/claseEntreno/obtener`);
  }

  getClaseEntrenoById(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/claseEntreno/obtener1`, { id });
  }

  createClaseEntreno(claseEntreno: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/claseEntreno/addclase`, claseEntreno);
  }

  updateClaseEntreno(claseEntreno: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/claseEntreno/editarClasePorId`, claseEntreno);
  }

  deleteClaseEntreno(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/claseEntreno/deleteClasePorId`, { body: { id } });
  }

  // Métodos para Reservas
  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reserva/obtener`);
  }

  getReservaById(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reserva/obtenerPorId`, { id });
  }

  getReservasPorUsuario(usuarioId: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/reserva/obtenerPorUsuario`, { usuarioId });
  }

  getReservasPorClase(claseId: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/reserva/obtenerPorClase`, { claseId });
  }

  getReservasPorDniCliente(dni: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/reserva/obtenerReservasPorDniCliente`, { dni });
  }

  createReserva(reserva: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reserva/addReserva`, reserva);
  }

  updateReserva(reserva: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/reserva/editarReserva`, reserva);
  }

  deleteReserva(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reserva/deleteReservaPorId`, { body: { id } });
  }


  // Métodos para Membresías
  getMembresias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/membresia/obtener`);
  }

  getMembresiaById(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/membresia/obtener1`, { id });
  }

  deleteMembresia(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/membresia/borrar1`, { body: { id } });
  }

  createMembresia(membresia: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/membresia/addmembresia`, membresia);
  }

  updateMembresia(membresia: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/membresia/editarMembresia`, membresia);
  }



  // Método para manejar errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la solicitud HTTP'));
  }

  // Método para autenticación (si lo necesitas)
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuario/auth`, credentials).pipe(
      tap(response => {
        if (response.result === 'ok') {
          localStorage.setItem('jwt', response.jwt);
        }
      })
    );
  }
}