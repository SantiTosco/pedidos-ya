import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
  refreshToken?: string;
}

// Interface para lo que realmente devuelve tu backend
interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';
  private http = inject(HttpClient);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<BackendLoginResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        map(response => {
          // Adaptamos la respuesta del backend al formato que espera el frontend
          
          return {
            success: true,
            message: 'Login exitoso',
            token: response.accessToken,
            refreshToken: response.refreshToken
            
            // user: undefined porque tu backend no lo devuelve actualmente
          };
        }),
        tap(response => {
          // 🎯 AQUÍ ES LA CLAVE: Guardamos los tokens y actualizamos el estado
          if (response.success && response.token) {
            this.setTokens(response.token, response.refreshToken);
            this.isAuthenticatedSubject.next(true);
            console.log('Usuario autenticado correctamente');
            
          }
        }),
        catchError(this.handleError)
      );

  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Credenciales inválidas';
          break;
        case 404:
          errorMessage = 'Usuario no encontrado';
          break;
        case 500:
          errorMessage = 'Error del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || 'Error desconocido'}`;
      }
    }
    
    return throwError(() => ({ success: false, message: errorMessage }));
  }
  // Método para guardar los tokens
  private setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
   // Método para verificar si hay un token válido
  private hasValidToken(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      // Opcional: Verificar si el token no ha expirado
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // const now = Date.now() / 1000;
      // return payload.exp > now;
      
      return true; // Por ahora solo verificamos que exista
    } catch {
      return false;
    }
  }

  // Método público para verificar autenticación (usado por el guard)
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

}
