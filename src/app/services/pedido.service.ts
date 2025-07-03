import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../pages/list-order/list-order.component'


@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<{ items: Pedido[] }> {
    return this.http.get<{ items: Pedido[] }>(this.apiUrl);
  }
}