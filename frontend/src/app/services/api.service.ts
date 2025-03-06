import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
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
    // // Verifica si el código se ejecuta en el navegador y si localStorage está disponible
    // if (isPlatformBrowser(this.platformId)) {
    //   const user = this.getUserFromLocalStorage(); // Obtén el usuario desde localStorage
    //   if (user) {
    //     this.userSubject.next(user); // Actualiza el BehaviorSubject con el usuario
    //   }
    // }
  }

  initializeUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const user = this.getUserFromLocalStorage();
        if (user) {
          console.log('Usuario inicializado desde localStorage:', user);
          this.userSubject.next(user);
        }
      }, 0);
    }
  }

  // Método para verificar si localStorage está disponible
  private isLocalStorageAvailable(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Método para verificar si el token JWT es válido
  private isTokenValid(): boolean {
    if (!this.isLocalStorageAvailable()) return false;

    try {
      const token = localStorage.getItem('jwt');
      if (!token) return false;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch (error) {
      console.error('Error al verificar el token:', error);
      return false;
    }
  }

  // Método para incluir el token JWT en las cabeceras
  private getAuthHeaders(): HttpHeaders {
    if (!this.isLocalStorageAvailable()) {
      return new HttpHeaders();
    }

    try {
      const token = localStorage.getItem('jwt');
      return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    } catch (error) {
      console.error('Error al obtener cabeceras de autenticación:', error);
      return new HttpHeaders();
    }
  }

  // Método para realizar el login
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuario/auth`, credentials).pipe(
      tap((response) => {
        if (response.result === 'ok') {
          if (this.isLocalStorageAvailable()) {
            localStorage.setItem('jwt', response.jwt);
          }

          this.getAuthenticatedUser().subscribe({
            next: (user) => {
              this.saveUserData(response.jwt, user);
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
      console.log('localStorage no está disponible (SSR)');
      return of(null); // IMPORTANTE: Devolver of(null) en lugar de throwError
    }

    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.warn('No hay token disponible en localStorage');
        return of(null); // IMPORTANTE: Devolver of(null) en lugar de throwError
      }

      const headers = this.getAuthHeaders();
      return this.http.get<any>(`${this.baseUrl}/usuario/who`, { headers }).pipe(
        tap((user) => {
          console.log('✅ Usuario autenticado recibido:', user);
          this.userSubject.next(user);
        }),
        catchError((error) => {
          console.error('Error al obtener el usuario autenticado:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
      return of(null);
    }
  }

  // Método para guardar el token y los datos del usuario en localStorage
  saveUserData(token: string, user: any): void {
    // Siempre actualizar el estado en memoria
    this.userSubject.next(user);

    // Solo intentar guardar en localStorage si estamos en el navegador
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem('jwt', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Datos del usuario guardados:', user);
      } catch (error) {
        console.error('Error al guardar datos en localStorage:', error);
      }
    }
  }

  // Método para obtener el usuario desde localStorage
  getUserFromLocalStorage(): any {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }

    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al obtener datos de localStorage:', error);
      return null;
    }
  }

  // Método para cerrar sesión
  // Método para cerrar sesión con opción de redirección
  logout(redirect: boolean = true): void {
    // Siempre limpiar el estado en memoria
    this.userSubject.next(null);

    // Solo intentar limpiar localStorage si estamos en el navegador
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Error al eliminar datos de localStorage:', error);
      }
    }

    // Redirigir solo si se solicita
    if (redirect) {
      this.router.navigate(['']);
    }
  }

  // Método para crear una reserva
  createReserva(reserva: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reserva/addReserva`, reserva).pipe(
      tap(response => console.log('Respuesta de creación de reserva:', response)),
      catchError(error => {
        console.error('Error al crear reserva:', error);
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