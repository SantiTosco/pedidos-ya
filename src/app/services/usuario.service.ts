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
  private apiUrl = 'http://localhost:3001'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient, ) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // O usar this.authService.getToken()
    console.log('🔍 Token enviado:', token ? 'TOKEN PRESENTE' : 'NO TOKEN');
    
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  
  }
  getProfile(): Observable<User> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<User>(`${this.apiUrl}/profile`, { headers }); // ← Cambiar aquí
  }
  // En usuario.service.ts
updateProfile(updateData: UpdateUserProfile): Observable<any> { // ⭐ Cambiar de Observable<User> a Observable<any>
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    
  return this.http.put<any>(`${this.apiUrl}/users/profile`, updateData, { headers });
}
  checkEmailExists(email: string, userId?: number): Observable<boolean> {
  const url = userId ? 
    `${this.apiUrl}/check-email/${email}?excludeUserId=${userId}` : 
    `${this.apiUrl}/check-email/${email}`;
  return this.http.get<boolean>(url);
  }
}
