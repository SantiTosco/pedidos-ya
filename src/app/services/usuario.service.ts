import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  password: string;
}

export interface UpdateUserProfile {
  email?: string;
  password?: string;
  // Sin id, porque se obtiene del usuario autenticado
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001'; // URL del backend

  constructor(private http: HttpClient ) {}
  
  // Obtiene los encabezados de autenticación con el token almacenado
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    console.log('🔍 Token enviado:', token ? 'TOKEN PRESENTE' : 'NO TOKEN');
    
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Obtiene el perfil del usuario autenticado (buscando por mail)
  findByEmail(): Observable<User> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<User>(`${this.apiUrl}/users/profile`, { headers }); 
  }
 // Actualiza los datos del perfil del usuario  
updateProfile(updateData: UpdateUserProfile): Observable<any> { 
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  
  return this.http.put<any>(`${this.apiUrl}/users/profile`, updateData, { headers });
}

// Verifica si un email ya está registrado (excluyendo opcionalmente a un usuario)
  checkEmailExists(email: string, userId?: number): Observable<boolean> {
  const url = userId ? 
    `${this.apiUrl}/check-email/${email}?excludeUserId=${userId}` : 
    `${this.apiUrl}/check-email/${email}`;
  return this.http.get<boolean>(url);
  }
}
