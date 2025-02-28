import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { PLATFORM_ID } from '@angular/core'; // Importa PLATFORM_ID

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  private userSubject = new BehaviorSubject<any>(null); // BehaviorSubject para obtener usuario
  user$ = this.userSubject.asObservable(); // Observable para obtener usuario en tiempo real

  // constructor(private http: HttpClient) {
  //   if (this.isLocalStorageAvailable()) {
  //     const user = this.getUserFromLocalStorage();
  //     if (user) {
  //       this.userSubject.next(user);
  //     }
  //   } else {
  //     console.warn('localStorage no está disponible en este entorno.');
  //   }
  // }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyecta PLATFORM_ID
  ) {
    // Verifica si el código se ejecuta en el navegador y si localStorage está disponible
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
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

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuario/auth`, credentials).pipe(
      tap(response => {
        if (response.result === 'ok' && this.isLocalStorageAvailable()) {
          localStorage.setItem('jwt', response.jwt);
          this.getAuthenticatedUser().subscribe({
            next: (user) => {
              this.saveUserData(response.jwt, user);
            },
            error: (error) => {
              console.error('Error al obtener el usuario autenticado:', error);
            }
          });
        }
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        return throwError(() => error);
      })
    );
  }


  // // Método para obtener el usuario autenticado
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

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}/usuario/who`, { headers }).pipe(
      tap(user => {
        console.log('✅ Usuario autenticado recibido:', user);
        this.userSubject.next(user);
      }),
      catchError(error => {
        console.error('Error al obtener el usuario autenticado:', error);
        return throwError(() => error);
      })
    );
  }

  // Método para guardar el token y el usuario en el localStorage
  saveUserData(token: string, user: any): void {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem('jwt', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Datos del usuario guardados:', user);
        this.userSubject.next(user);
      } catch (error) {
        console.error('Error al guardar datos en localStorage:', error);
      }
    } else {
      console.warn('localStorage no está disponible en este entorno.');
    }
  }

  // Método para obtener el usuario del localStorage
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
        this.userSubject.next(null);
      } catch (error) {
        console.error('Error al eliminar datos de localStorage:', error);
      }
    } else {
      console.warn('localStorage no está disponible en este entorno.');
    }
  }



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

  deleteUsuario(id: number): Observable<any> {
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

}






