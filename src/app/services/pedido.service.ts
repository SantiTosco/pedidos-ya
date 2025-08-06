import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../pages/list-order/list-order.component'
import { HttpParams } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  getPedidos(page: number = 1, limit: number = 10): Observable<any> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());

  return this.http.get<any>(this.apiUrl, { params });
}
}
  /*getPedidos(): Observable<{ items: Pedido[] }> {
    return this.http.get<{ items: Pedido[] }>(this.apiUrl);
  }
}/*
/*getPedidos(page: number = 1, limit: number = 10): Observable<any> {
  return this.http.get<any>(`/pedidos?page=${page}&limit=${limit}`);
}*/