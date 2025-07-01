import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async getData(): Promise<
    Array<{ name: string; description: string; image: string }>
  > {
     return (await axios.get(config.urls.getFood)).data
  }

  async getItemsOnCart(): Promise<
    Array<{ image: string; name: string; price: number; quantity: number }>
    > {
      return (await axios.get(config.urls.getCart)).data
    }
}
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/order'; // URL del backend

  constructor(private http: HttpClient) {}

  getPedidos() {
    return this.http.get('http://localhost:3000/order');
  }
}
