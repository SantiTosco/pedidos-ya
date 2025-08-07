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

<<<<<<< HEAD
  constructor(private http: HttpClient ) {}

=======
  constructor(private http: HttpClient, ) {}
  
  // Obtiene los encabezados de autenticación con el token almacenado
>>>>>>> b1cd2f9d5cdc0cace21dad9e0612f205a3e659cd
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    console.log('🔍 Token enviado:', token ? 'TOKEN PRESENTE' : 'NO TOKEN');
    
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
<<<<<<< HEAD


  findByEmail(): Observable<User> {
=======
  // Obtiene el perfil del usuario autenticado
  getProfile(): Observable<User> {
>>>>>>> b1cd2f9d5cdc0cace21dad9e0612f205a3e659cd
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<User>(`${this.apiUrl}/users/profile`, { headers }); 
  }
<<<<<<< HEAD

  // En usuario.service.ts
  updateProfile(updateData: UpdateUserProfile): Observable<any> { // ⭐ Cambiar de Observable<User> a Observable<any>
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
=======
 // Actualiza los datos del perfil del usuario  
updateProfile(updateData: UpdateUserProfile): Observable<any> { // ⭐ Cambiar de Observable<User> a Observable<any>
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
>>>>>>> b1cd2f9d5cdc0cace21dad9e0612f205a3e659cd
  });
    
  return this.http.put<any>(`${this.apiUrl}/users/profile`, updateData, { headers });
}

<<<<<<< HEAD
=======
// Verifica si un email ya está registrado (excluyendo opcionalmente a un usuario)
>>>>>>> b1cd2f9d5cdc0cace21dad9e0612f205a3e659cd
  checkEmailExists(email: string, userId?: number): Observable<boolean> {
  const url = userId ? 
    `${this.apiUrl}/check-email/${email}?excludeUserId=${userId}` : 
    `${this.apiUrl}/check-email/${email}`;
  return this.http.get<boolean>(url);
  }
}
