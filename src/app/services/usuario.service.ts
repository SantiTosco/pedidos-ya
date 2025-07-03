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

  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // O usar this.authService.getToken()
    console.log('🔍 Token enviado:', token ? 'TOKEN PRESENTE' : 'NO TOKEN');
    
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, {
      headers: this.getAuthHeaders()
    });
  }
  updateProfile(updateData: UpdateUserProfile): Observable<User> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.put<User>(`${this.apiUrl}/users/profile`, updateData, { headers });
  }
}