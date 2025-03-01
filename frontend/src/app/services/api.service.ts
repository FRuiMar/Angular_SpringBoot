import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para redirecciones

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  private userSubject = new BehaviorSubject<any>(null); // BehaviorSubject para el estado del usuario
  user$ = this.userSubject.asObservable(); // Observable para el estado del usuario

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router // Inyecta Router para redirecciones
  ) {
    // Verifica si el código se ejecuta en el navegador y si localStorage está disponible
    if (isPlatformBrowser(this.platformId)) {
      const user = this.getUserFromLocalStorage(); // Obtén el usuario desde localStorage
      if (user) {
        this.userSubject.next(user); // Actualiza el BehaviorSubject con el usuario
      }
    }
  }

  // Método para verificar si localStorage está disponible
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Método para verificar si el token JWT es válido
  private isTokenValid(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
      const expirationDate = new Date(payload.exp * 1000); // Convierte la fecha de expiración
      return expirationDate > new Date(); // Devuelve true si el token no ha caducado
    } catch (error) {
      console.error('Error al verificar el token:', error);
      return false;
    }
  }

  // Método para incluir el token JWT en las cabeceras
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Método para realizar el login
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuario/auth`, credentials).pipe(
      tap((response) => {
        if (response.result === 'ok' && this.isLocalStorageAvailable()) {
          localStorage.setItem('jwt', response.jwt); // Guarda el token JWT en localStorage
          this.getAuthenticatedUser().subscribe({
            next: (user) => {
              this.saveUserData(response.jwt, user); // Guarda los datos del usuario
            },
            error: (error) => {
              console.error('Error al obtener el usuario autenticado:', error);
            },
          });
        }
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return throwError(() => error);
      })
    );
  }

  // Método para obtener el usuario autenticado
  getAuthenticatedUser(): Observable<any> {
    if (!this.isLocalStorageAvailable()) {
      console.error('localStorage no está disponible');
      return throwError(() => new Error('localStorage no está disponible'));
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
      console.warn('No hay token disponible en localStorage');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = this.getAuthHeaders(); // Incluye el token en las cabeceras
    return this.http.get<any>(`${this.baseUrl}/usuario/who`, { headers }).pipe(
      tap((user) => {
        console.log('✅ Usuario autenticado recibido:', user);
        this.userSubject.next(user); // Actualiza el estado del usuario
      }),
      catchError((error) => {
        console.error('Error al obtener el usuario autenticado:', error);
        return throwError(() => error);
      })
    );
  }

  // Método para guardar el token y los datos del usuario en localStorage
  saveUserData(token: string, user: any): void {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem('jwt', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Datos del usuario guardados:', user);
        this.userSubject.next(user); // Actualiza el estado del usuario
      } catch (error) {
        console.error('Error al guardar datos en localStorage:', error);
      }
    } else {
      console.warn('localStorage no está disponible en este entorno.');
    }
  }

  // Método para obtener el usuario desde localStorage
  getUserFromLocalStorage(): any {
    if (this.isLocalStorageAvailable()) {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        console.error('Error al obtener datos de localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Método para cerrar sesión
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        this.userSubject.next(null); // Actualiza el estado del usuario a null
      } catch (error) {
        console.error('Error al eliminar datos de localStorage:', error);
      }
    } else {
      console.warn('localStorage no está disponible en este entorno.');
    }
  }

  // Método para crear una reserva
  createReserva(reserva: any): Observable<any> {
    if (!this.isTokenValid()) {
      this.logout(); // Cierra la sesión si el token no es válido
      return throwError(() => new Error('Token JWT inválido o caducado'));
    }

    const headers = this.getAuthHeaders(); // Incluye el token en las cabeceras
    return this.http.post(`${this.baseUrl}/reserva/addReserva`, reserva, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.logout(); // Cierra la sesión si el servidor devuelve un error de autenticación
          this.router.navigate(['/login']); // Redirige al login
        }
        return throwError(() => error);
      })
    );
  }

  // Métodos para Usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuario/obtener`);
  }

  getUsuarioById(id: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuario/obtenerPorId`, { id });
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuario/addUsuario`, usuario);
  }

  updateUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/editUsuarioPorId`, usuario);
  }

  deleteUsuario(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuario/deleteUsuarioPorId`, { body: { id } });
  }

  // Métodos para Entrenadores
  getEntrenadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/entrenador/obtener`);
  }

  getEntrenadorById(id: any): Observable<any> {
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

  deleteEntrenador(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/entrenador/borrarEntrenadorPorId`, { body: { id } });
  }

  // Métodos para Clase-Gym
  getClasesEntreno(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/claseEntreno/obtener`);
  }

  getClaseEntrenoById(id: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/claseEntreno/obtener1`, { id });
  }

  createClaseEntreno(claseEntreno: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/claseEntreno/addclase`, claseEntreno);
  }

  updateClaseEntreno(claseEntreno: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/claseEntreno/editarClasePorId`, claseEntreno);
  }

  deleteClaseEntreno(id: any): Observable<any> {
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

  updateReserva(reserva: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/reserva/editarReserva`, reserva);
  }

  deleteReserva(id: any): Observable<any> {
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
}