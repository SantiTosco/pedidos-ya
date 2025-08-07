import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, firstValueFrom } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';
import axios from 'axios';

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

interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  // URL base del backend
  private apiUrl = 'http://localhost:3001';
  private http = inject(HttpClient);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Inicia sesión del usuario
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<BackendLoginResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        map(response => {
          return {
            success: true,
            message: 'Login exitoso',
            token: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user  
          };
        }),
        tap(response => {
          //Guardamos los tokens y actualizamos el estado
          if (response.success && response.token) {
            this.setTokens(response.token, response.refreshToken);
            this.setUser(response.user);
            this.isAuthenticatedSubject.next(true);
            console.log('Usuario autenticado correctamente');
            
          }
        }),
        catchError(this.handleError)
      );

  }

  // Registra un nuevo usuario
  register(user: RegisterRequest): Observable<RegisterResponse> {
    console.log('AuthService.register() llamado con:', user);

    return this.http.post<any>(`${this.apiUrl}/users/register`, user)
    .pipe(
      tap(rawResponse => {
        console.log('RESPUESTA CRUDA del backend:', rawResponse); 
      }),
      map(response =>{
        console.log('map() ejecutado, response:', response);
        console.log("Usuario:", response.user);
        return {
          success: true,
          message: 'Usuario registrado correctamente',
          token: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user
        };
      }),
      tap(response => {
        console.log('tap() ejecutado, response:', response);
        //Guardamos los tokens y actualizamos el estado
        if (response.success && response.token) {
          this.setTokens(response.token, response.refreshToken);
          this.setUser(response.user);
          this.isAuthenticatedSubject.next(true);
          console.log('Usuario autenticado correctamente');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Maneja errores de las peticiones HTTP
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
    console.log('Token guardado:', localStorage.getItem('accessToken'));
  }

  // Guarda datos del usuario en localStorage
  private setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

   // Método para verificar si hay un token válido
  hasValidToken(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Método para actualizar el estado de autenticación
  updateAuthStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  // Método público para verificar autenticación (usado por el guard)
  isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken'); 
  const user = localStorage.getItem('user');
  return !!(token && user);
}

  //metodo logout
  logout(): void {
    //Elimina los tokens y el usuario del localStorage
    localStorage.removeItem('token'); 
    localStorage.removeItem('refreshToken'); 
    localStorage.removeItem('user'); 
    //Actualiza el estado de autenticación
    this.updateAuthStatus(false);
  }

  // Método para validar si el token ha expirado
  private isTokenExpired(token: string): boolean {
    try {
      //Obtiene el payload del token
      const payload = JSON.parse(atob(token.split('.')[1]));
      //Obtiene la fecha actual
      const now = Date.now() / 1000;
      //Valida fecha (para ver si expiró o no)
      return payload.exp < now;
    } catch (error) {
      //Si el token no es válido, devuelve true (expirado)
      return true;
    }
  }

  // Método para obtener el token de la sesión
  getToken(): string | null {
    //Recupera el token del localStorage
    return localStorage.getItem('token');
  }

  // Método para obtener el usuario actual
  getCurrentUser(): any {
    //Recupera el usuario del localStorage
    const userStr = localStorage.getItem('user');
    //Devuelve el usuario 
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtiene el ID del usuario
  getUsuarioId(): number | null {
  const token = this.getToken();
  if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload del token:', payload);
      return payload.sub || payload.id || payload.usuarioId;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  //Valida si existe el mail
  async findMails(): Promise<string[]> {
    return await firstValueFrom(this.http.get<string[]>(`${this.apiUrl}/users/mails`));
  }
}
