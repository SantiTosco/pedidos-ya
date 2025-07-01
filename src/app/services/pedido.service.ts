import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}