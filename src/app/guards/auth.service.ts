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
  user: {
    id: string;
    email: string;
    name: string;
    // agrega otros campos que devuelva tu backend
  };
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
            refreshToken: response.refreshToken,
            user: response.user  
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
  hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }


  updateAuthStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  // Método público para verificar autenticación (usado por el guard)
  isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken'); // ✅ Usar mismo nombre
  const user = localStorage.getItem('user');
  return !!(token && user);
}

  //metodo logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.updateAuthStatus(false);
  }
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (error) {
      return true;
    }
  }
  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
