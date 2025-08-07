import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../pages/list-order/list-order.component'
import { HttpParams } from '@angular/common/http';



@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  getPedidos(page: number = 1, limit: number = 10): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('🔍 Token enviado:', token ? 'TOKEN PRESENTE' : 'NO TOKEN');

    const params = new HttpParams()
      .set('page', page.toString())
      .set('quantity', limit.toString());

    console.log('Haciendo petición a:', this.apiUrl); // Para debug

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
}