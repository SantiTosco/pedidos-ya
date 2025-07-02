import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

export interface UpdateUserProfile {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/profile`);
  }

  updateProfile(userData: UpdateUserProfile): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile`, userData);
  }
}